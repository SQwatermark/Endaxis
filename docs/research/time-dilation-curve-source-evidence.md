# Time-dilation curve source evidence

## Scope

This note resolves how native `TimeDilationAction` chooses between
`curveKey` and `timeScaleCurve`. It applies to the paired 1.4.4 data baseline
used by the Next operator generator.

`buff_physical_handle_cryst_break` contains several actions with all three of
the following values:

- `useCurveKey = true`;
- `curveKey = "interrupt_weakness"`;
- a populated two-key `timeScaleCurve`.

Field presence therefore does not establish that both curves participate.

## Native evidence

The inspected desktop module is:

- `D:\Hypergryph Launcher\games\Endfield Game\GameAssembly.dll`;
- SHA-256
  `0C5573679BC6DEC2D068A14335466DB7CCF20AF9BAE2B983FB9D45677D80FFCE`.

The matching IL2CPP metadata is
`D:\Projects\IL2CPP-Dumper\Arknights Endfield 1.4.4\IL2CPP_Dump_Normal\Gameplay.Beyond.dll.cs`.
It gives these `TimeDilationAction.Data` offsets:

- `useCurveKey`: `0x38`;
- `curveKey`: `0x40`;
- `timeScaleCurve`: `0x48`.

`TimeDilationAction.ExecuteInternal` starts at RVA `0x042D8710`. Static
disassembly of the hash-matched module shows:

- `0x042D889D`: compare `byte ptr [data + 0x38]` with zero;
- true branch `0x042D88D8..0x042D8913`: obtain the configured curve map, read
  `[data + 0x40]`, and resolve that named key;
- false branch `0x042D891D..0x042D8926`: read `[data + 0x48]` directly.

The branches join at `0x042D892A`, after a single curve object has been
selected. The native implementation does not combine the two sources and does
not fall back from a missing named curve to the serialized inline curve.

## Generator consequence

The generator treats `useCurveKey` as the authoritative discriminator:

- `true` requires a non-empty `curveKey` and emits only the named curve;
- `false` requires a non-empty, structurally valid inline curve and emits only
  that curve;
- the inactive field is still structurally parsed so schema drift is not
  silently accepted, but a populated inactive inline curve is not an XOR
  failure.

This is a source-selection rule proven from native control flow, not a special
case for `buff_physical_handle_cryst_break`.
