
// Example note
/*
2024-05-15 20:39 PDT

Overhead Press
115 x 8
110 x 7

Deadlift
315 x 3
305 x 2

Barbell Row
155 x 10
150 x 9

Pull-Up
Bodyweight x 8
Bodyweight x 8
Bodyweight x 8

Bench Press
155 x 10
150 x 9
*/

// Desired output: map of exercise names to a map of dates to an array of set tuples: [weight, units, reps]
/*
{
    "Bench Press": {
        "2024-05-15": [
            [155, "lbs", 10],
            [160, "lbs", 9],
            [165, "lbs", 8]
        ],
        "2024-05-16": [
            [155, "lbs", 10],
            [160, "lbs", 9],
            [165, "lbs", 8]
        ],
        "2024-05-17": [
            [155, "lbs", 10],
            [160, "lbs", 9],
            [165, "lbs", 8]
        ],
    },
    "Deadlift": {
        "2024-05-15": [
            [315, "lbs", 3],
            [305, "lbs", 2]
        ],
        "2024-05-16": [
            [315, "lbs", 3],
            [305, "lbs", 2]
        ],
        "2024-05-17": [
            [315, "lbs", 3],
            [305, "lbs", 2]
        ],
    },
}
*/

type Unit = "lbs" | "kg";
type Set = [weight: number, unit: Unit, reps: number];
type ExerciseData = { [date: string]: Set[] };
type WorkoutData = { [exercise: string]: ExerciseData };

export function parseNote(note: string, exerciseData: WorkoutData) {
    const workoutData: WorkoutData = {};

    // Parse each line
    const lines = note.split('\n');
    let currentDate = '';
    let currentExercise = '';
    lines.forEach(line => {
        // Check if line is a date (YYYY-MM-DD format)
        if (line.match(/^\d{4}-\d{2}-\d{2}/)) {
            currentDate = line.split(' ')[0]; // Extract just the date portion
        }
        // Check if line contains exercise data (weight x reps format)
        else if (line.match(/^\d+\sx\s\d+$/) || line.match(/^(Bodyweight|Body)\sx\s\d+$/)) {
            if (currentDate && currentExercise) {
                // Parse the set data
                // TODO: the line is not always in the format "weight x reps"
                // TODO: sometimes it's "weight x reps x sets"
                const [weight, reps] = line.split('x').map(s => s.trim().toLowerCase());
                // TODO: Get user's bodyweight from the database
                // Estimate bodyweight exercises at 150lbs
                const weightNum = weight === 'bodyweight' || weight === 'body' ?
                    150 :
                    parseInt(weight);
                const repsNum = parseInt(reps);
                const volume = weightNum * repsNum;

                // Create exercise entry if it doesn't exist
                if (!workoutData[currentExercise]) {
                    workoutData[currentExercise] = {};
                }

                // Create date entry if it doesn't exist
                if (!workoutData[currentExercise][currentDate]) {
                    workoutData[currentExercise][currentDate] = [];
                }

                // Update date entry with the workout 'set' data
                // TODO: handle different units
                workoutData[currentExercise][currentDate].push([weightNum, "lbs", repsNum])
            }
        }
        // If line is just text, it's probably an exercise name
        else if (line.trim()) {
            currentExercise = line.trim();
        }
    });

    return workoutData;
}