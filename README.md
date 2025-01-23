# **App Overview and Functionality**

I don’t have a separate backend because I’m using **Next.js** as both the frontend and backend. Data is fetched directly from **NeonDB (PostgreSQL)** via **Drizzle ORM** queries, eliminating the need for an additional API layer. This approach is highly efficient, as all queries are cached, significantly reducing response times and resource usage. Here's how the app works:

1. **Authentication and User Management**:

   - The app uses **Clerk** to handle user authentication, sign-ups, log-ins, and session management seamlessly.

2. **Data Synchronization**:

   - **Clerk Webhooks** automatically sync user data with the database. For example, when a user registers or updates their profile, the data is stored in **NeonDB** instantly.

3. **Database and Query Handling**:

   - **NeonDB**, a serverless PostgreSQL database, is the backbone for data storage.
   - Queries are written using **Drizzle ORM**, which ensures type safety and a developer-friendly interface for interacting with the database.

4. **UI and Framework**:

   - Built with **Next.js**, the app uses server-side rendering (SSR) for fast, dynamic data fetching and rendering.
   - UI components are styled and managed with **ShadCN**, offering a modern, responsive design system.

5. **Performance Optimization**:

   - Query caching reduces database load and improves application responsiveness.
   - By directly connecting Next.js to the database, the architecture remains lightweight, avoiding the need for a traditional backend.
