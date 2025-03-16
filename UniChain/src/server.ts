import { createServer } from "http";
import app from "./app";
import lostItemRoutes from './routes/lostItem.routes';
import studentRoutes from './routes/student.routes';

const PORT = 8000;;

// Register routes
app.use('/api/lost-items', lostItemRoutes);
app.use('/api/students', studentRoutes);

const server = createServer(app);
if (process.env.VERCEL) {
  module.exports = app;
} else {
  server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

export default app;

