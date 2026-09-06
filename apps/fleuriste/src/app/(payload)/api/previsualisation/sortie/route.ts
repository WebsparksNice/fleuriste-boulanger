import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/** Quitte la previsualisation et revient au contenu publie. */
export const GET = async () => {
  const brouillon = await draftMode()
  brouillon.disable()
  redirect('/')
}
