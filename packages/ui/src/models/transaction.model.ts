export enum Frequency {
  Daily = 'Daily',
  Weekly = 'Weekly',
  BiWeekly = 'BiWeekly',
  Monthly = 'Monthly',
  Annually = 'Annually',
}

export type Transaction = {
  id: number
  amount: number
  description: string
  disabled: boolean
  frequency: Frequency | null
  recurring: boolean
  startDate: string
  userId: number
  createdAt: string
}
