
export const apiSuccess = (data) => {
  return {
      code: 200,
      status: 'success',
      data: data
  }
}

export const apiError = (message) => {
  return {
      code: 400,
      status: 'error',
      error: message
  }
}