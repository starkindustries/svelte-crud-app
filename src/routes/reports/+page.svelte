<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { todos, type Todo } from '$lib/stores/todos';
	import { type WorkoutData, parseNote } from './parse-notes';
	import Chart, { DatasetController } from 'chart.js/auto';

	const reports = [
		{ id: 1, title: 'Bench Press', value: '100 lbs', date: '2024-03-31' },
		{ id: 2, title: 'Pull-ups', value: '12 reps', date: '2024-03-31' },
		{ id: 3, title: 'Deadlift', value: '225 lbs', date: '2024-03-31' },
		{ id: 4, title: 'Push-ups', value: '30 reps', date: '2024-03-31' },
		{ id: 5, title: 'Squats', value: '185 lbs', date: '2024-03-31' }
	];

	function goBack() {
		goto('/');
	}

	function parseWorkoutData(): WorkoutData {
		const workoutData: WorkoutData = {};
		$todos.forEach(todo => {
			parseNote(todo["note"], workoutData);
		});
		return workoutData;
	}

	onMount(() => {
		const container = document.getElementById('reportsPage') as HTMLDivElement;
		if (!container) {
			throw new Error('Container not found');
		}

		const workoutData = parseWorkoutData();
		console.log(workoutData);

		// Loop through each exercise in the workoutData object
		for (const [exerciseName, exerciseData] of Object.entries(workoutData)) {

			// calculate volume per exercise
			let dates = [];
			let volumes = [];
			for (const [date, sets] of Object.entries(exerciseData)) {
				dates.push(date);
				let volume = 0;
				// TODO: VERY IMPORTANT: handle unit
				for (const [weight, _unit, reps] of sets) {
					volume += weight * reps;
				}
				volumes.push(volume)
			}

			// verify that dates and volumes are the same length
			if (dates.length !== volumes.length) {
				throw new Error('Assertion failed: dates and volumes are not the same length');
			}

			// Create a canvas element for this chart
			const div = document.createElement('div');
			div.classList.add('chart-container');
			const canvas = document.createElement('canvas');
			div.appendChild(canvas);
			container.appendChild(div);

			// Create a new chart instance
			new Chart(canvas, {
				type: 'line',
				data: {
					labels: dates,
					datasets: [{
						label: exerciseName + ' Volume (lbs × reps)',
						data: volumes,
						borderColor: '#3b82f6',
						backgroundColor: 'rgba(59, 130, 246, 0.1)',
						tension: 0.4,
						fill: true
					}]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							labels: {
								color: 'rgba(255, 255, 255, 0.7)'
							}
						}
					},
					scales: {
						x: {
							grid: {
								color: 'rgba(255, 255, 255, 0.1)'
							},
							ticks: {
								color: 'rgba(255, 255, 255, 0.7)'
							}
						},
						y: {
							grid: {
								color: 'rgba(255, 255, 255, 0.1)'
							},
							ticks: {
								color: 'rgba(255, 255, 255, 0.7)'
							}
						}
					}
				}
			});
		}
	});
</script>

<div class="reports-page" id="reportsPage">
	<div class="top-bar">
		<button class="back-button" on:click={goBack} aria-label="Go back">
			←
		</button>
		<h1>Exercise Volume Report</h1>
	</div>
	<div class="chart-container">
		<canvas id="volumeChart"></canvas>
	</div>
</div>

<style>
	.reports-page {
		min-height: 100vh;
		background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
		color: white;
		font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
	}

	.top-bar {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: rgba(30, 30, 30, 0.95);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.back-button {
		background: none;
		border: none;
		color: rgba(255, 255, 255, 0.7);
		font-size: 1.5rem;
		padding: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 2.5rem;
	}

	.back-button:hover {
		color: white;
	}

	h1 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: normal;
	}

	.chart-container {
		padding: 1rem;
		height: 70vh;
		background: rgba(250, 9, 9, 0.842);
		border-radius: 8px;
		margin: 1rem;
		backdrop-filter: blur(10px);
	}
</style>