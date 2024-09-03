export default defineEventHandler(async (event) => {
  const { book, lessonId } = getQuery(event)
  await sendRedirect(event, `/nce/book${book}/${lessonId}.json`)
})
