(function() {
    "use strict";

    //引数のエレメント全てに特定のイベントで発火する関数を定義する
    function setEventToAllObject(elements, event, func) {
        Object.keys(elements).forEach(function(key) {
            elements[key].addEventListener(event, func, false);
        });
    }
    /**
     * getTableData
     * ソート処理イベント
     *
     * @param {HTMLElement} tableElem - テーブル
     * @return {Array} data - tableElemのデータ配列
     */
    function getTableData(tableElem) {
        var data = [];
        //1行目を飛ばす
        for (var i = 1, l = tableElem.length; i < l; i++) {
            for (var j = 0, m = tableElem[i].cells.length; j < m; j++) {
                if (typeof data[i] === "undefined") {
                    data[i] = {};
                    data[i]["key"] = i; //ソート用のキー設定
                }
                data[i][j] = tableElem[i].cells[j].innerText;
            }
        }
        return data;
    }
    /**
     * sortEvent
     * ソート処理イベント
     *
     * @param {HTMLElement} elem - クリックされたエレメント
     * @return {boolean} true
     */
    function sortEvent(elem) {
        var ascClass = "order-asc";
        var descClass = "order-desc";

        //操作対象のテーブルを特定する
        //TABLEタグが見つかるまでelemの親要素をたどる
        var closest = function(th) {
            var parent = th.parentNode;
            if (parent.tagName.toUpperCase() === "TABLE") {
                return parent;
            }
            return closest(parent);
        };
        var table = closest(elem);
        if (!table) {
            return;
        }

        //列番号取得
        var colNo = elem.cellIndex;
        //テーブルデータ取得
        var tableData = getTableData(table.querySelectorAll("tr"));

        //ソート処理
        //sortOrder=1なら昇順・sortOrder=-1なら降順
        var sortOrder = !elem.classList.contains(ascClass) ? 1 : -1;
        tableData.sort(function(a, b) {
            if (a[colNo] < b[colNo]) {
                return -1 * sortOrder;
            } else if (a[colNo] > b[colNo]) {
                return sortOrder;
            }
            return 0;
        });

        //ソート後のHTMLを構築して書き換え
        var html = "";
        tableData.forEach(function(x) {
            html += table.querySelectorAll("tr")[x["key"]].outerHTML;
        });
        table.querySelector("tbody").innerHTML = html;

        //テーブルの昇順降順Classをクリア・設定する
        var tableElem = table.querySelectorAll("thead th");
        Object.keys(tableElem).forEach(function(key) {
            tableElem[key].classList.remove(descClass);
            tableElem[key].classList.remove(ascClass);
        });
        if (sortOrder === 1) {
            elem.classList.add(ascClass);
        }else {
            elem.classList.add(descClass);
        }
    }

    //ロード時にソート用イベントをバインドする
    window.addEventListener("load", function() {
        var elem = document.querySelectorAll("table.sortable thead th");
        setEventToAllObject(elem, "click", function(e) {sortEvent(e.target); });
    }, false);

})();
