require.config({
    paths: {
        'step': '../step'
    },

    config: {
        step: {
            steps: [
                ['one'],
                ['two'],
                ['three'],
                ['four']
            ]
        }
    }
});

require(['step!four'], function () {
    doh.register(
        "simple",
        [
            function simple(t) {
                t.is("one", two.oneName);
                t.is("two", three.twoName);
                t.is("three", four.threeName);
                t.is("four", four.name);
            }
        ]
    );

    doh.run();
});
