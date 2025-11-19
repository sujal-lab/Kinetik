import express from "express";
const router = express.Router();

// Your exercise data
const EXERCISE_DATA = {
  arms: [
    { name: "Hammer curl", perRep: 0.36 },
    { name: "Bicep curl", perRep: 0.35 },
    { name: "Overhead Triceps Extension", perRep: 0.45 },
    { name: "Tricep dips", perRep: 0.7 },
    { name: "Tricep dumbbell kickback", perRep: 0.48 },
    { name: "Zottman curl", perRep: 0.38 },
    { name: "Overhead press", perRep: 0.9 },
    { name: "Lying triceps extension", perRep: 0.6 },
    { name: "Side lateral raise", perRep: 0.28 },
    { name: "Concentration curls", perRep: 0.34 },
    { name: "Pull-up", perRep: 1.0 },
    { name: "Push-down", perRep: 0.5 },
    { name: "Overhead cable curl", perRep: 0.35 },
    { name: "Diamond push up", perRep: 0.8 },
    { name: "Close grip bench press", perRep: 0.95 },
    { name: "Push-up", perRep: 0.6 },
    { name: "Wrist curl", perRep: 0.12 },
    { name: "One arm dumbbell preacher curl", perRep: 0.36 },
    { name: "Tate press", perRep: 0.5 },
    { name: "Front raise", perRep: 0.3 },
    { name: "Arm stretch", perRep: 0.05 },
    { name: "Seated dumbbell palms-up wrist curl", perRep: 0.12 },
    { name: "Incline dumbbell curl", perRep: 0.38 },
    { name: "EZ-Bar skullcrusher", perRep: 0.55 },
    { name: "Incline hammer curls", perRep: 0.38 },
    { name: "Bench press (close-grip)", perRep: 1.0 },
    { name: "Dip", perRep: 0.9 },
    { name: "Push press", perRep: 1.05 },
    { name: "Reverse barbell curl", perRep: 0.36 },
    { name: "Reverse flye", perRep: 0.28 },
    { name: "Palms-down wrist curl", perRep: 0.12 },
    { name: "Upright row", perRep: 0.7 },
    { name: "Weighted bench dip", perRep: 0.95 },
    { name: "One-arm dumbbell row", perRep: 0.9 }
  ],

  legs: [
    { name: "Squat (BW)", perRep: 0.9 },
    { name: "Back squat", perRep: 1.2 },
    { name: "Leg press", perRep: 0.95 },
    { name: "Lunge", perRep: 0.7 },
    { name: "Step-up", perRep: 0.6 },
    { name: "Calf raise", perRep: 0.25 },
    { name: "Romanian deadlift", perRep: 1.1 },
    { name: "Bulgarian split squat", perRep: 0.95 },
    { name: "Glute bridge", perRep: 0.6 },
    { name: "Front squat", perRep: 1.1 },
    { name: "Hack squat", perRep: 1.0 },
    { name: "Sumo deadlift", perRep: 1.3 },
    { name: "Leg curl", perRep: 0.7 },
    { name: "Leg extension", perRep: 0.6 },
    { name: "Walking lunge", perRep: 0.75 },
    { name: "Wall sit", perMinute: 6.0 },
    { name: "Good morning", perRep: 0.5 },
    { name: "Goblet squat", perRep: 0.9 },
    { name: "Hip thrust", perRep: 0.8 },
    { name: "Jump squat", perRep: 1.1 },
    { name: "Side lunge", perRep: 0.65 },
    { name: "Box jump", perRep: 1.0 }
  ],

  core: [
    { name: "Crunches", perRep: 0.28 },
    { name: "Sit-ups", perRep: 0.4 },
    { name: "Plank", perMinute: 4.0 },
    { name: "Leg Raises", perRep: 0.45 },
    { name: "Russian Twist", perRep: 0.25 },
    { name: "Mountain Climbers", perMinute: 8.5 },
    { name: "Bicycle Crunches", perRep: 0.35 },
    { name: "High plank", perMinute: 4.5 },
    { name: "Lateral plank walk", perMinute: 6.5 },
    { name: "Reverse crunch", perRep: 0.4 },
    { name: "Side plank", perMinute: 5.0 },
    { name: "Flutter kicks", perMinute: 7.0 },
    { name: "Hanging leg raise", perRep: 0.55 },
    { name: "Toe touches", perRep: 0.35 },
    { name: "V-up", perRep: 0.45 },
    { name: "Plank shoulder tap", perMinute: 6.0 },
    { name: "Heel touch", perRep: 0.25 },
    { name: "Jackknife sit-up", perRep: 0.5 }
  ],

  cardio: [
    { name: "Running (moderate)", perMinute: 10 },
    { name: "Running (fast)", perMinute: 13 },
    { name: "Cycling (moderate)", perMinute: 8 },
    { name: "Cycling (vigorous)", perMinute: 12 },
    { name: "Jump Rope", perMinute: 12 },
    { name: "Burpees", perMinute: 10 },
    { name: "Rowing (vigorous)", perMinute: 11 }
  ]
};

// Route to send this data
router.get("/", (req, res) => {
  res.json(EXERCISE_DATA);
});

export default router;
