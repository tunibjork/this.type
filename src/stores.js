import { writable, derived } from 'svelte/store';

export const codeSnippets = writable([
	`function twoAdds (num) {\n\treturn function (second_num) {\n\t\treturn num + second_num;\n\t};\n};`,
	`function reverseString (str) {\n\treturn str.split(' ').reverse().join(' ');\n};`,
	`function isPalindrome (str) {\n\treturn str === str.split('').reverse().join('');\n};`,
	`function shuffleArray (arr) {\n\treturn arr.sort(() => 0.5 - Math.random());\n};`,
	`function findUniqueValues (arr) {\n\treturn arr.filter(el => {\n\t\treturn arr.indexOf(el) === arr.lastIndexOf(el);\n\t});\n};`,
	`const getRandomItem = (arr) => {\n\treturn arr[Math.floor(Math.random() * arr.length)];\n};`,
	`function deleteDuplicates (arr) {\n\treturn [...new Set(arr)];\n};`
]);

export const correctInput = writable('');
export const incorrectInput = writable('');

export const totalKeypresses = writable(0);
export const correctKeypresses = writable(0);
export const enterCount = writable(0);

export const typingMode = writable(false);
export const activeError = writable(false);
export const finished = writable(false);

export const timerRunning = writable(false);
export const startTime = writable();

export const accuracy = derived(
	[correctKeypresses, totalKeypresses],
	([$correctKeypresses, $totalKeypresses]) => {
		return ($correctKeypresses / $totalKeypresses) * 100;
	}
);
