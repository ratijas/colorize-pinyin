var test = unitjs,
    test_div = document.getElementById('test');

window.ColorizeFilter.rootNode = function(){return test_div};

function fromstring (html) {
    var el = document.createElement('a');
    el.innerHTML = html;
    if (el.children.length > 1) {
        throw new Error('unexpected characters');
    }
    return el.children[0];
}

_1_baiwen = 'bǎiwén bùrú yījiàn // fāng’àn // fǎngán // xúniang';
_2_baiwen = '2 bǎiwén';
_3_nongmingong = '3 nóngmíngōng';
_4_kou_anshang = '4 kǒu’ànshàng';
_5_kouanshang = '5 kǒuànshàng';
_6_fengongsi = '6 fēngōngsī';
_7_aiyo = '7 āiyō';
_8_shenme = '8 shénme';
_9_fadia = '9 fādiǎ';
_10_zhiding = '10 zhǐdìng';
_11_yi1_yi4 = '11 yī; yì';
_12_nanguo_langxingoufei_er_eryide = '12 nánguò // lángxīngǒufèi // èr’ěryīde';
_13_trailing = 'hánshùshì[de]';


_.map([
    _1_baiwen,
    _2_baiwen,
    _3_nongmingong,
    _4_kou_anshang,
    _5_kouanshang,
    _6_fengongsi,
    _7_aiyo,
    _8_shenme,
    _9_fadia,
    _10_zhiding,
    _11_yi1_yi4,
    _12_nanguo_langxingoufei_er_eryide,
    _13_trailing
    ],
    function (txt) {
        var p = document.createElement('p');
        p.textContent = txt;
        test_div.appendChild(p);
});


describe('IgnoreLinksNodeFilterTestCase', function () {
    var filter = window.ColorizeFilter.filterNode
    
    it('test_link_tag', function () {
        link = fromstring("<A HREF='http://bkrs.info/slovo.php?ch=仁'>仁</A>");
        test.assert(! filter(link));
    });
    it('test_other', function () {
        tag = fromstring('<div class="py">rén<img class="pointer" src="images/player/negative_small/playup.png" /></div>')
        test.assert(filter(tag));
    });
});

describe('ColorizedHTMLStringTestCase', function () {
    it.skip('test_pairs', function () {
    });
});

describe('RangesOfPinyinInStringTestCase', function () {
    var cmd = function (pinyin) {
        var result = searchForPinYinInString(pinyin),
            keys = _.sortBy(_.map(Object.keys(result), Number), Number),
            pairs = [];
        for (var i = 0; i < keys.length; i++) {
            var offset = keys[i];
            p = result[offset];
            pairs.push([offset, p.length]);
        };
        return pairs;
    };

    it('test_one_word', function () {
        test.assert(_.isEqual(cmd("bǎi"), [[0, 3]]));
        test.assert(_.isEqual(cmd(" jiàn."), [[1, 4]]));
        test.assert(_.isEqual(cmd("...-niang, ..."), [[4, 5]]));
    });
    it('test_two_words', function () {
        test.assert(_.isEqual(cmd("Gōngzuò"), [[0, 4], [4, 3]]));
    });
    it('test_baiwen_buru_yijian', function () {
        test.assert(_.isEqual(cmd(_1_baiwen), [
            [0, 3], [3, 3], [7, 2], [9, 2], [12, 2], [14, 4],
            [22, 4], [27, 2], [33, 3], [36, 3], [43, 2], [45, 5]]));
    });
    it('test_missing_apostrophe', function () {
        console.log(cmd('àiài'));
        test.assert(_.isEqual(cmd('àiài'), [[0, 2], [2, 2]]));
    });
});

describe('DetermineToneTestCase', function () {
    it('testFristTone', function () {
        test.assert.equal(1, determineTone('fāng'));
        test.assert.equal(1, determineTone('yī'));
    });
    it('testSecondTone', function () {
        test.assert.equal(2, determineTone('gán'));
        test.assert.equal(2, determineTone('xún'));
    });
    it('testThirdTone', function () {
        test.assert.equal(3, determineTone('fǎn'));
        test.assert.equal(3, determineTone('lǚ'));
    });
    it('testFourthTone', function () {
        test.assert.equal(4, determineTone('àn'));
        test.assert.equal(4, determineTone('dìnggòu'));
    });
    it('testZeroTone', function () {
        test.assert.equal(0, determineTone('de'));
        test.assert.equal(0, determineTone('ning'));
    });
    it('testNonPinyin', function () {
        test.assert.equal(0, determineTone('бурда'));
    });
    it('testMixedPinyin', function () {
        test.assert.equal(3, determineTone('bǎiwén'));
    });
});