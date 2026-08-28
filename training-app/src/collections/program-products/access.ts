import type { Access } from 'payload'

import { isAdmin } from '../../access'

/** Published products are readable by anyone; coaches see all. */
export const publicOrAdminRead: Access = ({ req: { user } }) => {
  if (user?.collection === 'users') return true
  return { published: { equals: true } }
}

export { isAdmin }
