// const env = {
//   appwrite: {
//     endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL),
//     projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
//     apikey: String(process.env.APPWRITE_API_KEY),
//   },
// };

// export default env;

// const env = {
//   appwrite: {
//     endpoint: process.env.NEXT_PUBLIC_APPWRITE_HOST_URL ?? "",
//     projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "",
//     // ✅ server-only (do NOT String() it)
//     apikey: process.env.APPWRITE_API_KEY,
//   },
// };

// export default env;

const env = {
  appwrite: {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_HOST_URL ?? "",
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "",
    apikey: process.env.APPWRITE_API_KEY, // server-only
  },
};

export default env;
