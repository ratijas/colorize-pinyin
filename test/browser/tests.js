'use strict';

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

var
_1_baiwen = 'bǎiwén bùrú yījiàn // fāng’àn // fǎngán // xúniang',
_2_baiwen = '2 bǎiwén',
_3_nongmingong = '3 nóngmíngōng',
_4_kou_anshang = '4 kǒu’ànshàng',
_5_kouanshang = '5 kǒuànshàng',
_6_fengongsi = '6 fēngōngsī',
_7_aiyo = '7 āiyō',
_8_shenme = '8 shénme',
_9_fadia = '9 fādiǎ',
_10_zhiding = '10 zhǐdìng',
_11_yi1_yi4 = '11 yī; yì',
_12_nanguo_langxingoufei_er_eryide = '12 nánguò // lángxīngǒufèi // èr’ěryīde',
_13_trailing = 'hánshùshì[de]',
_14_aiai = 'àiài';


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
    _13_trailing,
    _14_aiai,
    ],
    function (txt) {
        var p = document.createElement('p');
        p.textContent = txt;
        test_div.appendChild(p);
});


describe('IgnoreLinksNodeFilterTestCase', function () {
    var filter = window.ColorizeFilter.filterNode
    
    it('test_link_tag', function () {
        var link = fromstring("<A HREF='http://bkrs.info/slovo.php?ch=仁'>仁</A>");
        test.assert(! filter(link));
    });
    it('test_other', function () {
        var tag = fromstring('<div class="py">rén<img class="pointer" src="images/player/negative_small/playup.png" /></div>')
        test.assert(filter(tag));
    });
});

describe('ColorizedHTMLStringTestCase', function () {
    var cmd = function (s) {
        var el = colorizedHTMLElementFromString(s);
        if (el)
            return el.outerHTML;
    }
    it('test_pairs', function () {
        test.assert.equal(cmd(_1_baiwen),
            '<span class="pinYinWrapper"><span class="t3">bǎi</span><span class="t2">wén</span> <span class="t4">bù</span><span class="t2">rú</span> <span class="t1">yī</span><span class="t4">jiàn</span> // <span class="t1">fāng</span>’<span class="t4">àn</span> // <span class="t3">fǎn</span><span class="t2">gán</span> // <span class="t2">xú</span><span class="t0">niang</span></span>');
        test.assert.equal(cmd(_2_baiwen),
            '<span class="pinYinWrapper">2 <span class="t3">bǎi</span><span class="t2">wén</span></span>');
        test.assert.equal(cmd(_3_nongmingong),
            '<span class="pinYinWrapper">3 <span class="t2">nóng</span><span class="t2">mín</span><span class="t1">gōng</span></span>');
        test.assert.equal(cmd(_4_kou_anshang),
            '<span class="pinYinWrapper">4 <span class="t3">kǒu</span>’<span class="t4">àn</span><span class="t4">shàng</span></span>');
        test.assert.equal(cmd(_5_kouanshang),
            '<span class="pinYinWrapper">5 <span class="t3">kǒu</span><span class="t4">àn</span><span class="t4">shàng</span></span>');
        test.assert.equal(cmd(_6_fengongsi),
            '<span class="pinYinWrapper">6 <span class="t1">fēn</span><span class="t1">gōng</span><span class="t1">sī</span></span>');
        test.assert.equal(cmd(_7_aiyo),
            '<span class="pinYinWrapper">7 <span class="t1">āi</span><span class="t1">yō</span></span>');
        test.assert.equal(cmd(_8_shenme),
            '<span class="pinYinWrapper">8 <span class="t2">shén</span><span class="t0">me</span></span>');
        test.assert.equal(cmd(_9_fadia),
            '<span class="pinYinWrapper">9 <span class="t1">fā</span><span class="t3">diǎ</span></span>');
        test.assert.equal(cmd(_10_zhiding),
            '<span class="pinYinWrapper">10 <span class="t3">zhǐ</span><span class="t4">dìng</span></span>');
        test.assert.equal(cmd(_11_yi1_yi4),
            '<span class="pinYinWrapper">11 <span class="t1">yī</span>; <span class="t4">yì</span></span>');
        test.assert.equal(cmd(_12_nanguo_langxingoufei_er_eryide),
            '<span class="pinYinWrapper">12 <span class="t2">nán</span><span class="t4">guò</span> // <span class="t2">láng</span><span class="t1">xīn</span><span class="t3">gǒu</span><span class="t4">fèi</span> // <span class="t4">èr</span>’<span class="t3">ěr</span><span class="t1">yī</span><span class="t0">de</span></span>');
        test.assert.equal(cmd(_13_trailing),
            '<span class="pinYinWrapper"><span class="t2">hán</span><span class="t4">shù</span><span class="t4">shì</span>[<span class="t0">de</span>]</span>');
        test.assert.equal(cmd(_14_aiai),
                             '<span class="pinYinWrapper"><span class="t4">ài</span><span class="t4">ài</span></span>');
        test.assert.equal(cmd('nothing here.'), undefined);
        // uppercase?
        test.assert.equal(cmd('À!'), '<span class="pinYinWrapper"><span class="t4">À</span>!</span>');
    });
});

describe('RangesOfPinyinInStringTestCase', function () {
    var cmd = rangesOfPinyinInString;

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


describe('UtilitiesTestCase', function () {
    var cmd = lowercaseStringByRemovingPinyinTones;

    it('test_lowercase_string_by_rempoving_pinyin_tones', function () {
        test.assert.equal(cmd("À! Zhēn měi!"), "a! zhen mei!");
        test.assert.equal(cmd(_1_baiwen), 'baiwen buru yijian // fang’an // fangan // xuniang');
        test.assert.equal(cmd("Nǐ lái háishi bù lái?"), "ni lai haishi bu lai?");

    });
});
