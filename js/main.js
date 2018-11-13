$(document).ready(function () {

    const ElementData = {
        naturalPitchClassValues: [["C", 0], ["D", 2], ["E", 4], ["F", 5], ["G", 7], ["A", 9], ["B", 11]],
        musicalAlphabet: ["C", "D", "E", "F", "G", "A", "B"],
        intervals: {},
        intervalArr: [],
        measureHalfSteps: function (lower, upper) {
            let lowerPitchClass = this.toPitchClass(lower);
            let upperPitchClass = this.toPitchClass(upper);
            let numHalfSteps = upperPitchClass - lowerPitchClass;
            if (numHalfSteps < 0)
                numHalfSteps += 12;
            return numHalfSteps;
        },
        toPitchClass: function (name) {
            let pitchClass = -1;
            let index = 0;
            while (pitchClass === -1) {
                if (name[0] === this.naturalPitchClassValues[index][0]) {
                    pitchClass = this.naturalPitchClassValues[index][1];
                } else {
                    index++;
                };
            };
            if (name.length === 1) { return pitchClass; };
            switch (name[1]) {
                case "#":
                    pitchClass++;
                    break;
                case "b":
                    pitchClass--;
                    break;
                case "X":
                    pitchClass += 2;
                    break;
            };
            if (name.length === 3 && name[2] === "b") { pitchClass -= 1 };
            if (pitchClass >= 12) { pitchClass -= 12 };
            return pitchClass;
        },
        toInterval: function (lower, upper) {//
            if (lower[lower.length - 1] === "4" || lower[lower.length - 1] === "5") {
                lower = lower.substr(0, lower.length - 1);
            };
            if (upper[upper.length - 1] === "4" || upper[upper.length - 1] === "5") {
                upper = upper.substr(0, upper.length - 1);
            }
            let intervalName = ""; /*That one is too hard!*/
            let indexOfUpper = this.musicalAlphabet.indexOf(upper[0]);
            let indexOfLower = this.musicalAlphabet.indexOf(lower[0]);
            let number = indexOfUpper - indexOfLower + 1;
            if (number <= 0) { number += 7 };
            let numHalfSteps = this.measureHalfSteps(lower, upper);
            switch (number) {
                case 2://qualities of 2nds(done)
                    switch (numHalfSteps) {
                        case 0:
                            intervalName = this.intervals.d2;
                            break;
                        case 1:
                            intervalName = this.intervals.m2;
                            break;
                        case 2:
                            intervalName = this.intervals.M2;;
                            break;
                        case 3:
                            intervalName = this.intervals.A2;;
                            break;
                    };
                    break;
                case 3://qualities of 3rds(done)
                    switch (numHalfSteps) {
                        case 2:
                            intervalName = this.intervals.d3;;
                            break;
                        case 3:
                            intervalName = this.intervals.m3;
                            break;
                        case 4:
                            intervalName = this.intervals.M3;
                            break;
                        case 5:
                            intervalName = this.intervals.A3;
                            break;
                    }
                    break;
                case 4://qualities of fourths(done)
                    switch (numHalfSteps) {
                        case 4:
                            intervalName = this.intervals.d4;
                            break;
                        case 5:
                            intervalName = this.intervals.P4;
                            break;
                        case 6:
                            intervalName = this.intervals.A4;
                            break;
                        case 7:
                            intervalName = this.intervals.AA4;
                    };
                    break;
                case 5://qualities of 5ths(done)
                    switch (numHalfSteps) {
                        case 6:
                            intervalName = this.intervals.d5;
                            break;
                        case 7:
                            intervalName = this.intervals.P5;
                            break;
                        case 8:
                            intervalName = this.intervals.A5;
                            break;
                    }
                    break;
                case 6://qualities of 6ths(done)
                    switch (numHalfSteps) {
                        case 7:
                            intervalName = this.intervals.d6;;
                            break;
                        case 8:
                            intervalName = this.intervals.m6
                            break;
                        case 9:
                            intervalName = this.intervals.M6;
                            break;
                        case 10:
                            intervalName = this.intervals.A6;
                            break;
                    }
                    break;
                case 7://qualities of 7ths 
                    switch (numHalfSteps) {
                        case 9:
                            intervalName = this.intervals.d7;
                            break;
                        case 10:
                            intervalName = this.intervals.m7;
                            break;
                        case 11:
                            intervalName = this.intervals.M7;
                            break;
                        case 0://HACK: 12 half steps is coming out as zero because of measureHalfSteps function
                            intervalName = this.intervals.A7;
                            break;
                    };
                    break;
                case 1://qualities of 8ths
                    //HACK: used 1 because of how we caculate the number. 
                    //as is, this function can't calculate unisons
                    switch (numHalfSteps) {
                        case 11:
                            intervalName = this.intervals.d8;
                            break;
                        case 0:
                            intervalName = this.intervals.P8;
                            break;
                        case 1:
                            intervalName = this.intervals.A8;
                            break;
                    }
                    break;
            };
            return intervalName;

        },
        Interval: function (fullName, abreviation, numHalfSteps) {
            this.fullName = fullName;
            this.abreviation = abreviation;
            this.numHalfSteps = numHalfSteps;
            this.upFrom = function (origin) {//origin in form "C#"
                //get number part of interval
                let originNumber = ElementData.musicalAlphabet.indexOf(origin[0]);//originNumber is alphabet index
                let resultNumber = originNumber + parseInt(abreviation[1] - 1);//resultNumber is alphabet index of result
                if (resultNumber >= 7) { resultNumber -= 7 }; //if index of answer > 7, wrap around
                let result = ElementData.musicalAlphabet[resultNumber];//translate result # to letter
                let intervalAsIs = ElementData.toInterval(origin, result);//test resulting interval before any accidentals
                const adjustUp = function (note) {
                    if (!note.endsWith("#") && !note.endsWith("b") && !note.endsWith("X")) {
                        //if note is just a letter name (no accidentals)
                        note += "#";//add a sharp
                    } else if (note.endsWith("#")) {
                        note = note.replace("#", "X");
                    } else if (note.endsWith("b")) {
                        note = note.substr(0, note.length - 1);
                    }
                    return note;
                };
                const adjustDown = function (note) {
                    if (!note.endsWith("#") && !note.endsWith("X")) {
                        //if note is just a letter name (no accidentals)
                        note += "b";//add a flat
                    } else if (note.endsWith("#")) {
                        note = note.substr(0, note.length - 1);
                    } else if (note.endsWith("b")) {
                        note += "b";
                    }
                    return note;
                };
                //adjust result until the interval is right
                let counter = 0;
                while (intervalAsIs.numHalfSteps !== this.numHalfSteps) {//if we already have the right note

                    if (intervalAsIs.numHalfSteps < this.numHalfSteps) {//if the interval is too small
                        result = adjustUp(result);
                    } else if (intervalAsIs.numHalfSteps > this.numHalfSteps) {//if the interval is too big
                        result = adjustDown(result);
                    };
                    intervalAsIs = ElementData.toInterval(origin, result);
                    counter += 1;
                    if (counter > 25) {
                        break;
                    }
                };
                return result;

            };
        },
        setUp: function () {
            let Interval = this.Interval;
            this.intervals.d2 = new Interval("Diminished Second", "d2", 0);
            this.intervals.m2 = new Interval("Minor Second", "m2", 1);
            this.intervals.M2 = new Interval("Major Second", "M2", 2);
            this.intervals.A2 = new Interval("Augmented Second", "A2", 3);
            this.intervals.d3 = new Interval("Diminished Third", "d3", 2);
            this.intervals.m3 = new Interval("Minor Third", "m3", 3);
            this.intervals.M3 = new Interval("Major Third", "M3", 4);
            this.intervals.A3 = new Interval("Augmented Third", "A3", 5);
            this.intervals.d4 = new Interval("Diminished Fourth", "d4", 4);
            this.intervals.P4 = new Interval("Perfect Fourth", "P4", 5);
            this.intervals.A4 = new Interval("Augmented Fourth", "A4", 6);
            this.intervals.AA4 = new Interval("Doubly Augmented Fourth", "AA4", 7);
            this.intervals.d5 = new Interval("Diminished Fifth", "d5", 6);
            this.intervals.P5 = new Interval("Perfect Fifth", "P5", 7);
            this.intervals.A5 = new Interval("Augmented Fifth", "A5", 8);
            this.intervals.d6 = new Interval("Diminished Sixth", "d6", 7);
            this.intervals.m6 = new Interval("Minor Sixth", "m6", 8);
            this.intervals.M6 = new Interval("Major Sixth", "M6", 9);
            this.intervals.A6 = new Interval("Augmented Sixth", "A6", 10);
            this.intervals.d7 = new Interval("Diminished Seventh", "d7", 9);
            this.intervals.m7 = new Interval("Minor Seventh", "m7", 10);
            this.intervals.M7 = new Interval("Major Seventh", "M7", 11);
            this.intervals.A7 = new Interval("Augmented Seventh", "A7", 12);
            this.intervals.d8 = new Interval("Diminished Octave", "d8", 11);
            this.intervals.P8 = new Interval("Perfect Octave", "P8", 12);
            this.intervals.A8 = new Interval("Augmented Octave", "A8", 13);
            //fill IntervalArr
            let k;
            for (let key in ElementData.intervals) {

                k = ElementData.intervals[key].abreviation;
                let filtered = ["A8", "d2", "d8", "d3", "d4", "A2", "A3", "AA4", "A5", "d6", "A6", "d7", "A7"];
                if (filtered.indexOf(k) === -1) {
                    ElementData.intervalArr.push(ElementData.intervals[key]);
                };

            };
        }
    };
    const ElementGenerator = {
        random: function (/*elementName*/) { //interval, triad, seventhChord, scale
            let letters = ElementData.musicalAlphabet;//get origin
            let lowerNote;
            const getOrigin = function () {
                let r = Math.floor(Math.random() * 7);
                let result = letters[r];
                let accidentals = ["", "#", "b"];
                r = Math.floor(Math.random() * 3);
                result += accidentals[r];
                return result;
            };
            lowerNote = getOrigin();
            const filterRare = function (note) {//to make certain notes come up less often
                let newNote = note;
                let isOnRareList = false;
                let rareList = ["B#", "E#", "Cb", "Fb", "A#", "G#", "D#"];
                for (i = 0; i < rareList.length; i++) {
                    if (note.includes(rareList[i])) {
                        isOnRareList = true;
                    };
                };
                if (isOnRareList === true) {
                    newNote = getOrigin();
                };
                return newNote;
            };
            lowerNote = filterRare(lowerNote);
            r = Math.floor(Math.random() * ElementData.intervalArr.length);//choose random interval
            let interval = ElementData.intervalArr[r];

            //test
            //interval = ElementData.intervals.m2;
            //end test


            let upperNote = interval.upFrom(lowerNote);
            let lowerOctave = 4;
            let upperOctave = 4;
            let x = letters.indexOf(lowerNote[0]);
            if (letters.indexOf(lowerNote[0]) > letters.indexOf(upperNote[0])) {
                upperOctave = 5;
            };
            if ((lowerNote + lowerOctave) === (upperNote + upperOctave)) {
                upperOctave += 1;
            };
            upperNote = upperNote + upperOctave;
            lowerNote = lowerNote + lowerOctave;
            return ([lowerNote, upperNote]);
        }
    };
    const Synthesizer = {
        that: this,
        synth: new Tone.Synth().toMaster(),
        numVoices: 2,
        polySynth: new Tone.PolySynth(this.numVoices, Tone.Synth).toMaster(),
        restartTransport: function () {
            if (Tone.Transport.state === "started") {
                Tone.Transport.stop(Tone.now());
            }
            this.synth.dispose();
            this.polySynth.dispose();
            this.synth = new Tone.Synth().toMaster();
            this.polySynth = new Tone.PolySynth(this.numVoices, Tone.Synth).toMaster();
        },
        playElement: function (notes, playTogether = true, delay = 0) {
            let that = this;
            this.restartTransport();
            let now;
            let note;
            let delayIncrement = .9;
            let duration = .8;
            for (let i = 0; i < notes.length; i++) {
                now = Tone.now();
                Tone.Transport.scheduleOnce(function (now) {
                    note = notes[i];
                    that.synth.triggerAttackRelease(note, duration);
                }, delay);
                delay += 1;
            };
            if (playTogether === true) {
                Tone.Transport.scheduleOnce(function (now) {
                    that.polySynth.triggerAttackRelease(notes, duration);
                }, delay);
            };
            Tone.Transport.start(now + .1);
            return;
        }
    };
    const start = function () {
        ElementData.setUp();
        let intervalName = $("#name");
        let lowerNoteDisplay = $("#lower");
        let upperNoteDisplay = $("#upper");
        let currentInterval = ElementGenerator.random();
        let updateAnswer = function (currentInterval) {
            let info = ElementData.toInterval(currentInterval[0], currentInterval[1]);
            intervalName.html(info.fullName);
            let lowerMinusOctave = currentInterval[0].substr(0, currentInterval[0].length - 1);
            let upperMinusOctave = currentInterval[1].substr(0, currentInterval[1].length - 1);
            lowerNoteDisplay.html(lowerMinusOctave);
            upperNoteDisplay.html(upperMinusOctave);
        };
        updateAnswer(currentInterval);
        $("#answer").hide();
        const newIntervalBtn = $("#new-interval");
        const handleNewInterval = function () {
            currentInterval = ElementGenerator.random();
            updateAnswer(currentInterval);
            Synthesizer.playElement(currentInterval);
        };
        newIntervalBtn.on("click", function () {
            handleNewInterval();
        })
        const replayBtn = $("#replay");
        const handleReplayBtn = function () {
            Synthesizer.playElement(currentInterval);
        };
        replayBtn.on("click", function () {
            handleReplayBtn();
        });
        $("#show_answer").on("click", function () {
            $("#answer").toggle(500);
        });
    };

    //tests
    const upFromTest = function (interval) {
        //example:upFromTest(ElementData.intervals.M3);
        let noteArr = ["C", "C#", "Db", "D", "D#", "Eb", "E", "Fb", "F", "E#", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B", "C"];
        for (let x = 0; x < noteArr.length; x++) {
            console.log("A " + interval.abreviation + " above " + noteArr[x] + " is " + interval.upFrom(noteArr[x]));
        };
    };
    const testIntervalArr = function () {
        console.log(ElementData.intervalList);
    };
    const testPlayElement = function () {
        const intervals = [["C4", "E4"], ["F#4", "B4"], ["Bb4", "F5"]];
        const triads = [["C4", "E4", "G4"], ["F#4", "B4", "E5"], ["Bb4", "F5", "C6"]];
        const seventhChords = [["C4", "E4", "G4", "B4"], ["F#4", "A4", "C#5", "E5"], ["A3", "C4", "Eb4", "Gb4"]];
        const scales = [["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
        ["D4", "E4", "F4", "G4", "A4", "Bb4", "C#5", "D5"],
        ["C4", "D4", "E4", "F#4", "G4", "A4", "B4", "C5"]];

        const test = function (element) {
            let playTogether = true;
            let delayFactor = element[0].length + 2;
            if (element === scales) {
                playTogether = false;
            };
            for (i = 0; i < 3; i++) {
                Synthesizer.playElement(element[i], playTogether, i * delayFactor);
            };
        };
        test(intervals);
        //test(triads);
        //test(seventhChords);
        //test(scales);
    };
    const testRandom = function () {
        let result = [];
        for (x = 0; x < 30; x++) {
            result = ElementGenerator.random(/*"interval"*/);
            console.log(result);
        };
    };

    start();

})
