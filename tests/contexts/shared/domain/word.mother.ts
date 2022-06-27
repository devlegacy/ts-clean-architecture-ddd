import { MotherCreator } from './mother.creator'

export class WordMother {
  static random({ minLength = 0, maxLength }: { minLength?: number; maxLength: number }): string {
    const length = Math.floor(Math.random() * (maxLength - minLength)) + minLength
    const word = MotherCreator.random().lorem.word(length)

    return word
  }
}
