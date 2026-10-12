#!/usr/bin/env python3
"""Generate the original 30-second, 100-BPM score using only Python's stdlib.

Every sound is synthesized here; no reference-video audio, samples or external
music are used. The fixed random seed makes the output reproducible.
"""

from array import array
from math import exp, pi, sin
from pathlib import Path
import random
import sys
import wave


SAMPLE_RATE = 44100
DURATION = 30
BPM = 100
BEAT = 60 / BPM
SAMPLES = SAMPLE_RATE * DURATION
TAU = 2 * pi

left = array("d", [0.0]) * SAMPLES
right = array("d", [0.0]) * SAMPLES
rng = random.Random(20261012)


def frequency(midi):
    return 440 * 2 ** ((midi - 69) / 12)


def add_tone(at, length, midi, gain, pan=0.0, softness=0.28, decay=1.8):
    """Soft additive keyboard/bass with an independent attack and release."""
    start = max(0, round(at * SAMPLE_RATE))
    count = min(round(length * SAMPLE_RATE), SAMPLES - start)
    hz = frequency(midi)
    for i in range(count):
        t = i / SAMPLE_RATE
        attack = min(1.0, t / 0.012)
        release = min(1.0, max(0, (length - t) / 0.09))
        phase = TAU * hz * t
        value = (
            sin(phase)
            + softness * sin(2 * phase)
            + softness * 0.2 * sin(3 * phase)
        )
        value *= gain * attack * release * exp(-decay * t)
        left[start + i] += value * (1.0 - pan * 0.4)
        right[start + i] += value * (1.0 + pan * 0.4)


def add_drum(at, kind):
    start = round(at * SAMPLE_RATE)
    length = {"kick": 0.24, "snare": 0.14, "hat": 0.055}[kind]
    count = min(round(length * SAMPLE_RATE), SAMPLES - start)
    previous = 0.0
    for i in range(max(0, count)):
        t = i / SAMPLE_RATE
        if kind == "kick":
            # Phase is the integral of a frequency falling from 145 to 48 Hz.
            phase = TAU * (48 * t + 97 * (1 - exp(-30 * t)) / 30)
            value = 0.29 * sin(phase) * exp(-19 * t)
        else:
            noise = rng.uniform(-1, 1)
            high_noise = noise - previous * 0.78
            previous = noise
            if kind == "snare":
                value = (0.065 * high_noise + 0.04 * sin(TAU * 185 * t)) * exp(-28 * t)
            else:
                value = 0.026 * high_noise * exp(-75 * t)
        left[start + i] += value
        right[start + i] += value


def compose():
    # C major -> A minor -> F major -> G major, with a playful eight-note motif.
    chords = [(48, 52, 55), (45, 48, 52), (41, 45, 48), (43, 47, 50)]
    melodies = [
        [72, 76, 79, 76, 74, 76, 79, 81],
        [76, 81, 79, 76, 72, 74, 76, 79],
        [77, 81, 84, 81, 79, 77, 76, 74],
        [74, 79, 83, 79, 77, 76, 74, 71],
    ]
    for bar in range(13):
        at = bar * 4 * BEAT
        chord = chords[bar % 4]
        for beat in range(4):
            t = at + beat * BEAT
            if t >= DURATION:
                continue
            bass = chord[0] - 12 + (7 if beat == 2 else 0)
            add_tone(t, 0.36, bass, 0.145, softness=0.15, decay=3.2)
            if beat % 2 == 0:
                add_drum(t, "kick")
            else:
                add_drum(t, "snare")
            for off in (0.0, 0.5):
                if t + off * BEAT < DURATION:
                    add_drum(t + off * BEAT, "hat")
            if beat in (0, 2):
                for voice, note in enumerate(chord):
                    add_tone(t, 0.95, note + 12, 0.046, (voice - 1) * 0.65,
                             softness=0.12, decay=1.6)
        for eighth, note in enumerate(melodies[bar % 4]):
            t = at + eighth * BEAT / 2
            if t >= DURATION:
                continue
            pan = -0.24 if eighth % 2 == 0 else 0.24
            add_tone(t, 0.24, note, 0.061, pan, softness=0.38, decay=6.8)
            # Quiet, short echo adds movement without an external reverb plugin.
            add_tone(t + 0.16, 0.18, note, 0.012, -pan, softness=0.1, decay=8)

    # Gentle ascending sparkles punctuate the editing milestones.
    for marker in (5.1, 9.2, 12.1, 15.4, 20.0, 24.0, 26.2):
        for step, note in enumerate((84, 88, 91, 96)):
            add_tone(marker + step * 0.075, 0.22, note, 0.032,
                     (step - 1.5) * 0.2, softness=0.1, decay=10)


def save():
    output = Path(__file__).resolve().parent.parent / "public" / "audio" / "score.wav"
    output.parent.mkdir(parents=True, exist_ok=True)
    peak = max(max(abs(x) for x in left), max(abs(x) for x in right), 1e-9)
    # Peak stays below full scale, retaining headroom even if voices overlap.
    scale = min(1.0, 0.87 / peak) * 32767
    pcm = array("h")
    for i, (l_sample, r_sample) in enumerate(zip(left, right)):
        t = i / SAMPLE_RATE
        fade = min(1.0, t / 0.18, max(0, (DURATION - t) / 0.75))
        pcm.append(round(l_sample * scale * fade))
        pcm.append(round(r_sample * scale * fade))
    if sys.byteorder != "little":
        pcm.byteswap()
    with wave.open(str(output), "wb") as handle:
        handle.setnchannels(2)
        handle.setsampwidth(2)
        handle.setframerate(SAMPLE_RATE)
        handle.writeframes(pcm.tobytes())
    final_peak = max(abs(x) for x in pcm) / 32767
    print(f"Generated public/audio/score.wav: {DURATION}s, {BPM} BPM, "
          f"stereo PCM16/{SAMPLE_RATE}Hz, peak={final_peak:.3f}, "
          f"{output.stat().st_size:,} bytes")


if __name__ == "__main__":
    compose()
    save()
