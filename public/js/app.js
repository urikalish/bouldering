// Use strict mode for better error handling
'use strict';

const score = 0;
const problems = [];

function getConfig() {
    return {
        maxProblemsForScore: 7,
        maxAttemptsPerProblem: 5,
        fallPenalty: 10,
        levels: [
            {
                v: 0,
                points: 100,
                problems: [1],
            },
            {
                v: 1,
                points: 200,
                problems: [2, 3],
            },
            {
                v: 2,
                points: 300,
                problems: [4, 5, 6, 7, 8],
            },
            {
                v: 3,
                points: 400,
                problems: [9, 10, 11, 12, 13],
            },
            {
                v: 4,
                points: 500,
                problems: [14, 15, 16, 17, 18],
            },
            {
                v: 5,
                points: 600,
                problems: [19, 20, 21, 22, 23],
            },
            {
                v: 6,
                points: 700,
                problems: [24, 25, 26, 27],
            },
            {
                v: 7,
                points: 800,
                problems: [28, 29],
            },
            {
                v: 8,
                points: 900,
                problems: [30],
            },
        ]
    }
}

function showResults() {
    const solvedProblems = [...problems].filter(p => p.successfulAttempt > 0);
    const problemsElm = document.getElementById('problems-value');
    problemsElm.textContent = solvedProblems.length.toString();

    solvedProblems.sort((a, b) => {
        if (a.score !== b.score) {
            return b.score - a.score;
        }
        return b.number - a.number;
    });

    const config = getConfig();
    const bestProblems = solvedProblems.slice(0, config.maxProblemsForScore);
    const score = bestProblems.reduce((sum, item) => sum + item.score, 0);
    const scoreElm = document.getElementById('score-value');
    scoreElm.textContent = score.toString();
}

function handleClickAttemptButton(event) {
    if ('vibrate' in navigator) {
        navigator.vibrate(15);
    }
    const problemNumber = Number(event.target.dataset.problem);
    const attemptNumber = Number(event.target.dataset.attempt);
    const config = getConfig();
    for (let i = 1; i <= config.maxAttemptsPerProblem; i++) {
        const btn = document.getElementById(`btn-${problemNumber}-${i}`)
        btn.classList.toggle('success', false);
        btn.classList.toggle('failure', false);
    }
    const p = problems.find(p => p.number === problemNumber);
    if (p.successfulAttempt === attemptNumber) {
        p.successfulAttempt = 0;
        p.score = 0;
    } else {
        p.successfulAttempt = attemptNumber;
        p.score = p.level.points - (config.fallPenalty * (attemptNumber - 1));
        for (let i = 1; i <= config.maxAttemptsPerProblem; i++) {
            const btn = document.getElementById(`btn-${problemNumber}-${i}`)
            if (i < attemptNumber) {
                btn.classList.toggle('failure', true);
            } else if (i === attemptNumber) {
                btn.classList.toggle('success', true);
            } else {
                break;
            }
        }
    }
    showResults();
}

function displayProblems() {
    const problemsSection = document.getElementById('problems-section');
    const config = getConfig();
    config.levels.forEach(l => {
        l.problems.forEach(p => {
            problems.push({
                number: p,
                level: l,
                successfulAttempt: 0,
                score: 0,
            });

            const lineElm = document.createElement('div');
            lineElm.classList.add('problem-line');

            const problemNumberElm = document.createElement('div');
            problemNumberElm.textContent = `${p < 10 ? '0' : ''}${p}`;
            problemNumberElm.classList.add('problem-number');
            lineElm.appendChild(problemNumberElm);

            for (let a = 1; a <= config.maxAttemptsPerProblem; a++) {
                const attemptBtnElm = document.createElement('button');
                attemptBtnElm.id = `btn-${p}-${a}`;
                attemptBtnElm.textContent = `${a}`;
                attemptBtnElm.classList.add('problem-attempt-btn');
                attemptBtnElm.dataset.problem = p.toString();
                attemptBtnElm.dataset.attempt = a.toString();
                attemptBtnElm.addEventListener('click', handleClickAttemptButton);
                lineElm.appendChild(attemptBtnElm);
            }

            const problemLevelElm = document.createElement('div');
            problemLevelElm.textContent = `V${l.v}`;
            problemLevelElm.classList.add('problem-level', `v${l.v}`);
            lineElm.appendChild(problemLevelElm);

            problemsSection.appendChild(lineElm);
        })
    });
}
