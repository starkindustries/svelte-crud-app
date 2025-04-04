
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

export function parseNote(note: string) {
    const volumeByExercise = new Map();
    const lines = note.split('\n');
    let currentDate = '';
    let currentExercise = '';

    // Parse each line
    lines.forEach(line => {
        // Check if line is a date (YYYY-MM-DD format)
        if (line.match(/^\d{4}-\d{2}-\d{2}/)) {
            currentDate = line.split(' ')[0]; // Extract just the date portion
        }
        // Check if line contains exercise data (weight x reps format)
        else if (line.match(/^\d+\sx\s\d+$/) || line.match(/^(Bodyweight|Body)\sx\s\d+$/)) {
            if (currentDate && currentExercise) {
                // Parse the set data
                const [weight, reps] = line.split('x').map(s => s.trim());
                const weightNum = weight === 'Bodyweight' || weight === 'Body' ?
                    // TODO: Get user's bodyweight from the database
                    // Estimate bodyweight exercises at 150lbs
                    150 :
                    parseInt(weight);
                const repsNum = parseInt(reps);
                const volume = weightNum * repsNum;

                // Create or update date entry
                volumeByExercise.set(
                    currentExercise,
                    (volumeByExercise.get(currentExercise) || 0) + volume
                );
            }
        }
        // If line is just text, it's probably an exercise name
        else if (line.trim()) {
            currentExercise = line.trim();
        }
    });

    return volumeByExercise;
}