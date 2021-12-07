module.exports = grammar({
  name: "racket",

  extras: ($) => [$.comment, /\s+/],

  rules: {
    source_file: ($) =>
      seq(
        $.lang_line,
        repeat($.datum),
      ),

    lang_line: ($) => seq("#lang", $.symbol),

    datum: ($) =>
      choice(
        $.number,
        $.symbol,
        $.string,
        $.boolean,
        $.list_or_pair,
        $.quoted_datum,
      ),

    boolean: ($) => choice($.true_lit, $.false_lit),
    true_lit: (_$) => token(choice("#t", "#T")),
    false_lit: (_$) => token(choice("#f", "#F")),

    string: (_$) => seq('"', /[^"]*/, '"'), // TODO: escaped quotes

    quoted_datum: ($) => seq(choice("'", "`"), $.datum),

    number: (_$) =>
      token(choice(
        /\d+([\./]\d+)?/,
        /#x[0-9A-Fa-f]+/,
      )),

    symbol: (_$) => /[^()\[\]{}",'`;#|\s\\]+/, // TODO: verbatim symbols with |

    list_or_pair: ($) =>
      choice(
        seq("(", repeat(choice($.datum, $.dot)), ")"),
        seq("[", repeat(choice($.datum, $.dot)), "]"),
        seq("{", repeat(choice($.datum, $.dot)), "}"),
      ),

    dot: (_$) => ".",

    comment: (_$) => token(seq(";", /.*/)),
  },
});
