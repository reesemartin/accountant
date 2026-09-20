import { CollectionReference, DocumentData, Query, WhereFilterOp } from 'firebase-admin/firestore'

export function applyListQuery<T extends DocumentData>(
  collection: CollectionReference<T>,
  params: {
    orderBy?: string
    orderByDirection?: 'asc' | 'desc' | 'ASC' | 'DESC'
    skip?: number
    take?: number
    where?: Array<[string, WhereFilterOp, unknown]>
  },
): Query<T> {
  let query: Query<T> = collection

  for (const [field, op, value] of params.where ?? []) {
    if (value !== undefined) {
      query = query.where(field, op, value)
    }
  }

  query = query.orderBy(
    params.orderBy || 'createdAt',
    (params.orderByDirection?.toLowerCase() as 'asc' | 'desc' | undefined) || 'desc',
  )

  if (params.skip) {
    query = query.offset(params.skip)
  }

  if (params.take) {
    query = query.limit(params.take)
  }

  return query
}
