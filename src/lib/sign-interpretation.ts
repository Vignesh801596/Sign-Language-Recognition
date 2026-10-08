export type SignType = "ASL Alphabet" | "ASL Number";

export function getSignInterpretation(sign: string): {
  signType: SignType;
  representation: string;
} {
  if (/^[A-Z]$/.test(sign)) {
    return {
      signType: "ASL Alphabet",
      representation: `The letter ${sign} in American Sign Language.`,
    };
  }

  return {
    signType: "ASL Number",
    representation: `The number ${sign} in American Sign Language.`,
  };
}