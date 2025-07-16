// export const baseURL = "https://redragon-production.up.railway.app/api/";
// export const baseURL = "https://reddragon-13cz.onrender.com/api/";
export const baseURL = "http://localhost:5000/api/";

export const getAllReviewsRoute = `${baseURL}blogs/all`;
export const CreateReviewRoute = `${baseURL}blogs/create`;
export const UpdateReviewRoute = `${baseURL}blogs/update`;
export const UploadeReviewRoute = `${baseURL}blogs/upload`;
export const DeleteReviewRoute = `${baseURL}blogs/delete`;
export const singleReviewRoute = `${baseURL}blogs/getreview`;
export const singleReviewBySlugRoute = `${baseURL}blogs/review`; // New route for slug-based access
export const LoginRoute = `${baseURL}admin/login`;
export const VerifyRoute = `${baseURL}admin/verify`;
