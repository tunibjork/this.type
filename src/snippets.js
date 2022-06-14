const snippets = [
	`function twoAdds (num) {\n\treturn function (second_num) {\n\t\treturn num + second_num;\n\t};\n}`,
	`function reverseString (str) {\n\treturn str.split(' ').reverse().join(' ');\n}`,
	`function isPalindrome (str) {\n\treturn str === str.split('').reverse().join('')\n}`,
	`function shuffleArray (arr) {\n\treturn arr.sort(() => 0.5 - Math.random());\n}`,
	`function findUniqueValues (arr) {\n\treturn arr.filter(el => {\n\t\treturn arr.indexOf(el) === arr.lastIndexOf(el);\n\t})\n}`
];
