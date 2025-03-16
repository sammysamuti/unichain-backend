import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler";
import studentRoutes from "./routes/student.routes";
import universityRoutes from "./routes/university.routes";
import mentalHealthRoutes from "./routes/mentalHealth.routes";
// import solanaRoutes from './routes/solana.routes';
import authRoutes from "./routes/auth.routes";
import studentDegreeRoutes from "./routes/studentDegree.routes";
import lostItemRoutes from './routes/lostItem.routes';
import foundItemRoutes from './routes/foundItem.routes';
import lostClaimRoutes from './routes/lostClaim.routes';

import counselingRoutes from "./routes/counseling.routes";
import sessionRoutes from "./routes/session.routes";

import walletRoutes from './routes/wallet.routes';
import notificationRoutes from './routes/notification.routes';


const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use("/api/students", studentRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/mental-health", mentalHealthRoutes);
// app.use('/api/solana', solanaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/student-degrees", studentDegreeRoutes);

// Lost & Found system routes
app.use('/api/lostItems', lostItemRoutes);
app.use('/api/foundItems', foundItemRoutes);
app.use('/api/claims', lostClaimRoutes);
app.use("/api/counselors", counselingRoutes);
app.use("/api/sessions", sessionRoutes);

app.use('/api/wallet', walletRoutes);
app.use('/api/notifications', notificationRoutes);

app.get("/", (req, res) => {
  res.send("Unichain Service  Is  Running");
});

app.use(errorHandler);

export default app;
