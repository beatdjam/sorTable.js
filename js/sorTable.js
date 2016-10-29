(function() {
    "use strict";

    //�����̃G�������g�S�Ăɓ���̃C�x���g�Ŕ��΂���֐����`����
    function setEventToAllObject(elements, event, func) {
        Object.keys(elements).forEach(function(key) {
            elements[key].addEventListener(event, func, false);
        });
    }
    /**
     * getTableData
     * �\�[�g�����C�x���g
     *
     * @param {HTMLElement} tableElem - �e�[�u��
     * @return {Array} data - tableElem�̃f�[�^�z��
     */
    function getTableData(tableElem) {
        var data = [];
        //1�s�ڂ��΂�
        for (var i = 1, l = tableElem.length; i < l; i++) {
            for (var j = 0, m = tableElem[i].cells.length; j < m; j++) {
                if (typeof data[i] === "undefined") {
                    data[i] = {};
                    data[i]["key"] = i; //�\�[�g�p�̃L�[�ݒ�
                }
                data[i][j] = tableElem[i].cells[j].innerText;
            }
        }
        return data;
    }
    /**
     * sortEvent
     * �\�[�g�����C�x���g
     *
     * @param {HTMLElement} elem - �N���b�N���ꂽ�G�������g
     * @return {boolean} true
     */
    function sortEvent(elem) {
        var ascClass = "order-asc";
        var descClass = "order-desc";

        //����Ώۂ̃e�[�u������肷��
        //TABLE�^�O��������܂�elem�̐e�v�f�����ǂ�
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

        //��ԍ��擾
        var colNo = elem.cellIndex;
        //�e�[�u���f�[�^�擾
        var tableData = getTableData(table.querySelectorAll("tr"));

        //�\�[�g����
        //sortOrder=1�Ȃ珸���EsortOrder=-1�Ȃ�~��
        var sortOrder = !elem.classList.contains(ascClass) ? 1 : -1;
        tableData.sort(function(a, b) {
            if (a[colNo] < b[colNo]) {
                return -1 * sortOrder;
            } else if (a[colNo] > b[colNo]) {
                return sortOrder;
            }
            return 0;
        });

        //�\�[�g���HTML���\�z���ď�������
        var html = "";
        tableData.forEach(function(x) {
            html += table.querySelectorAll("tr")[x["key"]].outerHTML;
        });
        table.querySelector("tbody").innerHTML = html;

        //�e�[�u���̏����~��Class���N���A�E�ݒ肷��
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

    //���[�h���Ƀ\�[�g�p�C�x���g���o�C���h����
    window.addEventListener("load", function() {
        var elem = document.querySelectorAll("table.sortable thead th");
        setEventToAllObject(elem, "click", function(e) {sortEvent(e.target); });
    }, false);

})();
