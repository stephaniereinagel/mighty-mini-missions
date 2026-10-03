"""Monte Carlo balance check for Ghost Word Run costume powers.

Mirrors the run rules in app.js (speed ramp, row spacing, choice ramp, streak bonus,
heart pickups) with a simple player model, then reports each costume's average score
relative to plain Boo for several kinds of player/trail.

    python3 tools/balance_sim.py [runs_per_cell]
"""
import random
import sys

H = 600  # typical trail height in px

# Keep in sync with POWERS in app.js.
POWERS = {
    "pumpkin-cap": dict(harvest_every=5, harvest_bonus=1),
    "witch-hat": dict(ramp=0.8),
    "cat-ears": dict(max_chances=4),
    "crown": dict(streak_every=4, streak_pay=4),
    "pirate-hat": dict(full_heart_every=4, full_heart_candy=3),
    "wizard-hat": dict(shield_recharge=8),
    "top-hat": dict(last_chance_bonus=2),
    "bat-wings": dict(catch_boost=0.15),
}

PLAYERS = {
    # name: (chance he knows each word, steering skill 0..1, choices (min,max))
    "knows trail, 2 paths": (0.95, 0.85, (2, 2)),
    "knows trail, 3 paths": (0.95, 0.85, (2, 3)),
    "knows words, slow hands": (0.92, 0.4, (2, 3)),
    "learning, 2 paths": (0.75, 0.75, (2, 2)),
    "learning, 3 paths": (0.75, 0.75, (3, 3)),
    "new trail, 3 paths": (0.55, 0.7, (3, 3)),
}


def run(know, steer_skill, choices, power, rng):
    p = power or {}
    ramp = p.get("ramp", 1.0)
    max_ch = p.get("max_chances", 3)
    chances = max_ch
    candy = streak = correct_total = 0
    t = 0.0
    last_pickup = -2
    shield = 1 if "shield_recharge" in p else 0
    since_shield = 0
    pending_heart = False
    rnd = 0
    while chances > 0 and rnd < 400:
        speed = 145 + (rnd * 9 + t * 1.3) * ramp
        rt = max(1.35, 2.35 - min(rnd, 30) * 0.025)
        spacing = min(H * 0.9, max(H * 0.6, speed * rt))
        t += spacing / speed

        # A heart floats between rows; spawned with the previous row.
        if pending_heart:
            pending_heart = False
            catch = min(0.95, (0.35 + 0.4 * steer_skill) * (1 - max(0, speed - 250) / 900) + p.get("catch_boost", 0))
            if rng.random() < catch:
                if chances < max_ch:
                    chances += 1
                else:
                    candy += p.get("full_heart_candy", 1)

        n = min(choices[1], choices[0] + rnd // 6)
        read = know + (1 - know) / n
        steer = max(0.45, 1 - max(0, speed - 230) / (650 + 500 * steer_skill))
        if rng.random() < read * steer:
            streak += 1
            correct_total += 1
            every = p.get("streak_every", 3)
            pay = p.get("streak_pay", 2) if streak % every == 0 else 1
            if chances == 1:
                pay += p.get("last_chance_bonus", 0)
            if "harvest_every" in p and correct_total % p["harvest_every"] == 0:
                pay += p["harvest_bonus"]
            candy += pay
            if "shield_recharge" in p and not shield:
                since_shield += 1
                if since_shield >= p["shield_recharge"]:
                    shield, since_shield = 1, 0
        elif shield:
            shield, since_shield = 0, 0
        else:
            chances -= 1
            streak = 0

        rnd += 1
        if rnd >= 1:
            needs = chances < max_ch
            since = rnd - last_pickup
            full_every = p.get("full_heart_every", 4)
            if (needs and since >= p.get("lifeline_every", 2)) or since >= full_every:
                last_pickup = rnd
                pending_heart = True
    return candy, rnd


def main():
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 4000
    rng = random.Random(7)
    names = list(POWERS)
    print(f"{'player':24}{'Boo':>7}" + "".join(f"{k.split('-')[0][:7]:>9}" for k in names))
    totals = {k: 0.0 for k in names}
    for label, (know, skill, ch) in PLAYERS.items():
        base = sum(run(know, skill, ch, None, rng)[0] for _ in range(n)) / n
        row = f"{label:24}{base:7.1f}"
        for k in names:
            avg = sum(run(know, skill, ch, POWERS[k], rng)[0] for _ in range(n)) / n
            gain = avg / base - 1
            totals[k] += gain
            row += f"{gain:+9.0%}"
        print(row)
    print(f"{'average gain':24}{'':7}" + "".join(f"{totals[k] / len(PLAYERS):+9.0%}" for k in names))


if __name__ == "__main__":
    main()
