export enum Frequency {
  Daily = 'Daily',
  Weekly = 'Weekly',
  BiWeekly = 'BiWeekly',
  Monthly = 'Monthly',
  BiMonthly = 'BiMonthly',
  Annually = 'Annually',
}

export type Transaction = {
  id: string
  amount: number
  description: string
  disabled: boolean
  frequency: Frequency | null
  recurring: boolean
  startDate: string
  createdAt: string
}
