interface BaseFormData {
  'form-name': string
}

type FormDataWithFile = BaseFormData & Record<string, string | File>
type FormDataWithoutFile = BaseFormData & Record<string, string>

/*
 * Encoding forms with attachments (input type file)
 */
function encodeWithFile(data: FormDataWithFile): FormData {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })

  return formData
}

/*
 * Encoding forms without attachments
 */
function encodeWithoutFile(data: FormDataWithoutFile): string {
  return Object.entries(data)
    .map(
      ([key, value]) =>
        encodeURIComponent(key) + '=' + encodeURIComponent(value),
    )
    .join('&')
}

function isFormDataWithFile(
  data: FormDataWithFile | FormDataWithoutFile,
): data is FormDataWithFile {
  return Object.values(data).some(value => value instanceof File)
}

/*
 * AJAX Netlify Forms submission
 */
export function submitFormToNetlify(
  data: FormDataWithFile | FormDataWithoutFile,
) {
  return fetch('/', {
    method: 'POST',
    ...(!isFormDataWithFile(data) && {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
    body: isFormDataWithFile(data)
      ? encodeWithFile(data)
      : encodeWithoutFile(data),
  })
}
