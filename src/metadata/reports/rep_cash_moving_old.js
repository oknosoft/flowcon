/**
 * ### Отчет Движение денег
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2017
 * @module rep_cash_moving
 * Created 01.08.2016
 */


// Форма отчета
$p.rep.cash_moving.form_rep = function (pwnd, attr) {

	// получаем форму типового отчета
	var wnd = this.constructor.prototype.form_rep.call(this, pwnd, attr);

	// добавляем элементы управления отчетом. в нашем случае - список касс
	var cont_cashboxes = document.createElement("DIV");
	cont_cashboxes.style.width = "100%";
	cont_cashboxes.style.height = "100%";
	wnd.elmnts.frm_prm.appendChild(cont_cashboxes);

	var grid_cashboxes = new dhtmlXGridObject(cont_cashboxes),
		data={
			rows:[]
		};
	grid_cashboxes.setHeader(" ,Касса");
	grid_cashboxes.setInitWidths("40,*");
	grid_cashboxes.setColumnMinWidth("30,200");
	grid_cashboxes.setColSorting("na,na");
	grid_cashboxes.setColTypes("ch,ro");
	grid_cashboxes.enableAutoWidth(true, 600, 180);
	grid_cashboxes.enableAutoHeight(true, 280);
	grid_cashboxes.init();
	$p.wsql.alasql("select ref, name from cat_cashboxes where not(ref = '00000000-0000-0000-0000-000000000000') order by name").forEach(function (row, ind, arr) {
		data.rows.push({ id:row.ref, data: [(ind+1) < arr.length ? 1 : 0, row.name]});
	});
	grid_cashboxes.parse(data,"json");
	wnd.elmnts.layout.attachEvent("onResizeFinish", function(){
		grid_cashboxes.setSizes();
	});
	wnd.elmnts.layout.attachEvent("onPanelResizeFinish", function(){
		grid_cashboxes.setSizes();
	});

	// добавляем метод для получения списка касс объектом отчета
	wnd.report.cashboxes_filter = function () {
		var res = [];
		grid_cashboxes.forEachRow(function(id){
			if(grid_cashboxes.cells(id,0).isChecked())
				res.push(id);
		});
		return res;
	};

};


// Методы объекта отчет
$p.RepCash_moving.prototype.__define({

	/**
	 * ### Формирует отчет
	 * @param obj
	 * @return Promise.<T>
	 */
	build: {
		value: function() {

			var date_sub = moment(this.daterange.date_from).subtract(1, 'day').toDate(),
				date_from = this.daterange.date_from.toDate(),
				date_till = this.daterange.date_till.toDate(),
				query_options = {
					reduce: true,
					limit: 10000,
					group: true,
					group_level: 4,
					startkey: [],
					endkey: [date_sub.getFullYear(), date_sub.getMonth()+1, date_sub.getDate(),"\ufff0"]
				},
				res = {
					data: [],
					readOnly: true,
					wordWrap: false,
					colWidths: [220, 120, 120, 120, 120],
					colHeaders: ['Касса', 'Нач. ост.', 'Приход', 'Расход', 'Кон. ост'],
					columns: [
						{type: 'text'},
						{type: 'numeric', format: '0 0.00'},
						{type: 'numeric', format: '0 0.00'},
						{type: 'numeric', format: '0 0.00'},
						{type: 'numeric', format: '0 0.00'}
					]
				},
				start_total = {},
				cashboxes = this.cashboxes_filter();

			return $p.wsql.pouch.local.doc.query("doc/cash_moving_date_cashbox", query_options)

				.then(function (data) {

					if(data.rows){
						data.rows.forEach(function (row) {

							if(cashboxes.indexOf(row.key[3]) == -1)
								return;

							if(!start_total.hasOwnProperty(row.key[3]))
								start_total[row.key[3]] = [0,0,0,0];

							start_total[row.key[3]][0] += row.value.total;
							start_total[row.key[3]][3] = start_total[row.key[3]][0];

						});
					}

					query_options.startkey = [date_from.getFullYear(), date_from.getMonth()+1, date_from.getDate(), ""];
					query_options.endkey = [date_till.getFullYear(), date_till.getMonth()+1, date_till.getDate(),"\ufff0"]

					return $p.wsql.pouch.local.doc.query("doc/cash_moving_date_cashbox", query_options)
				})
				.then(function (data) {

					if(data.rows){

						data.rows.forEach(function (row) {

							if(cashboxes.indexOf(row.key[3]) == -1)
								return;

							if(!start_total.hasOwnProperty(row.key[3]))
								start_total[row.key[3]] = [0,row.value.debit,row.value.credit,row.value.total];
							else{
								start_total[row.key[3]][1] += row.value.debit;
								start_total[row.key[3]][2] += row.value.credit;
								start_total[row.key[3]][3] += row.value.debit - row.value.credit;
							}

						});

						for(var key in start_total){
							var row = start_total[key];
							res.data.push([
								$p.cat.cashboxes.get(key),
								row[0],
								row[1],
								row[2],
								row[3]
							]);
						}


					}

					return res;
				});
		}
	},

	allow_offline: {
		value: true
	}

});


