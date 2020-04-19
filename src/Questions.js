class Questions {
    constructor(jsonScheme) {
        this.title = jsonScheme.title;
        this.rounds = jsonScheme.rounds;
    }

    getQuestion(roundIndex, categoryId, questionId) {
        const category = this.rounds[roundIndex].find(({id}) => id === categoryId);
        return category.questions.find(({id}) => id === questionId);
    }
}

module.exports = Questions;
