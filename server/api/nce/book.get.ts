export default defineEventHandler(async (event) => {
  const { book } = getQuery(event)
  await sendRedirect(event, `/nce/book${book}.json`)
})
