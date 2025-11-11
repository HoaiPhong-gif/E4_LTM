export const successResponse = (data, message = "Success") => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message = "Error", data = null) => ({
  success: false,
  message,
  data,
});
