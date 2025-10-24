// Use strict mode for better error handling
'use strict';

const config = {
    numOfScoredProblems: 7,
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
};

const problems = [];

function showResults() {
    const solvedProblems = [...problems].filter(p => p.successfulAttempt > 0);
    const problemsElm = document.getElementById('problems-value');
    problemsElm.textContent = `${solvedProblems.length}/${config.numOfScoredProblems}`;

    solvedProblems.sort((a, b) => {
        if (a.score !== b.score) {
            return b.score - a.score;
        }
        return b.number - a.number;
    });

    const bestProblems = solvedProblems.slice(0, config.numOfScoredProblems);
    const score = bestProblems.reduce((sum, item) => sum + item.score, 0);
    const scoreElm = document.getElementById('score-value');
    scoreElm.textContent = score.toString();
}

function handleClickAttempt(event) {
    const targetElm = event.currentTarget;
    if (!targetElm.dataset?.problem || !targetElm.dataset?.attempt) {
        return;
    }
    if ('vibrate' in navigator) {
        navigator.vibrate(15);
    }
    const problemNumber = Number(targetElm.dataset.problem);
    const attemptNumber = Number(targetElm.dataset.attempt);
    for (let i = 1; i <= config.maxAttemptsPerProblem; i++) {
        const btn = document.getElementById(`btn-${problemNumber}-${i}`)
        btn.classList.toggle('success', false);
    }
    const p = problems.find(p => p.number === problemNumber);
    if (p.successfulAttempt === attemptNumber) {
        p.successfulAttempt = 0;
        p.score = 0;
    } else {
        p.successfulAttempt = attemptNumber;
        p.score = p.level.points - (config.fallPenalty * (attemptNumber - 1));
        const btn = document.getElementById(`btn-${problemNumber}-${attemptNumber}`)
        btn.classList.toggle('success', true);
    }
    showResults();
}

function displayProblems() {
    const problemsSection = document.getElementById('problems-section');
    config.levels.forEach(l => {
        l.problems.forEach(p => {
            problems.push({
                number: p,
                level: l,
                successfulAttempt: 0,
                score: 0,
            });

            const lineElm = document.createElement('div');
            lineElm.classList.add('problem-line', `v${l.v}`);

            const problemLineIdentifierElm = document.createElement('div');
            problemLineIdentifierElm.classList.add('problem-identifier');

            const problemLevelElm = document.createElement('div');
            problemLevelElm.textContent = `V${l.v}`;
            problemLevelElm.classList.add('problem-level');
            problemLineIdentifierElm.appendChild(problemLevelElm);

            const problemNumberElm = document.createElement('div');
            problemNumberElm.textContent = `${p < 10 ? '0' : ''}${p}`;
            problemNumberElm.classList.add('problem-number');
            problemLineIdentifierElm.appendChild(problemNumberElm);

            lineElm.appendChild(problemLineIdentifierElm);

            for (let a = 1; a <= config.maxAttemptsPerProblem; a++) {
                const attemptElm = document.createElement('div');
                attemptElm.id = `btn-${p}-${a}`;
                attemptElm.classList.add('problem-attempt');
                attemptElm.dataset.problem = p.toString();
                attemptElm.dataset.attempt = a.toString();
                attemptElm.dataset.text = a === 1 ? 'F' : a.toString();
                attemptElm.addEventListener('click', handleClickAttempt);

                const attemptSuccessElm = document.createElement('div');
                attemptSuccessElm.classList.add('problem-attempt-success');
                // attemptSuccessElm.style.background = `url("img/hold5.svg") no-repeat center`;
                attemptSuccessElm.style.transform = `rotate(${Math.floor(Math.random()*90 - 45)}deg)`;
                attemptElm.appendChild(attemptSuccessElm);

                lineElm.appendChild(attemptElm);
            }

            problemsSection.appendChild(lineElm);
        })
    });
}
