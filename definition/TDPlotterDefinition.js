Ext.define('myPath.TDPlotterDefinition', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.TDPlotter',
	requires:['Ext.grid.plugin.RowEditing'],
	frame:true,
	layout:'anchor',
    width    : 490,
    bodyPadding  : 10,
	mapContainer:'',
	initComponent : function() {
		// initialize UI
        this.items = this.panelItems();
		this.buttons = this.panelButtons();
		Ext.define('Coordinates',{
			extend:'Ext.data.Model',
			fields:[
				'ns', 'deg', 'min', 'ew', 'dist'
			]
		});
		
		// must always be called
        this.callParent(arguments);
    },
	//Data Store for points
	lagayan: function(){
		return Ext.create('Ext.data.Store', {
			storeId:'storeCoordinatesValue',
			fields:['ns', 'deg', 'min', 'ew', 'dist'],
			data:[
				{'ns':'S',"deg":10,"min":0, "ew":"W", "dist":20},
				{'ns':'N',"deg":90,"min":0, "ew":"E", "dist":40},
				{'ns':'N',"deg":0,"min":0, "ew":"E", "dist":18},
				{'ns':'N',"deg":90,"min":0, "ew":"E", "dist":18},
				{'ns':'S',"deg":4,"min":0, "ew":"W", "dist":40},
				{'ns':'N',"deg":85,"min":0, "ew":"W", "dist":30},
				{'ns':'S',"deg":2,"min":0, "ew":"W", "dist":5},
				{'ns':'N',"deg":85,"min":0, "ew":"W", "dist":16},
				{'ns':'N',"deg":2,"min":0, "ew":"W", "dist":6},
				{'ns':'N',"deg":85,"min":0, "ew":"W", "dist":26},
				{'ns':'N',"deg":0,"min":0.5, "ew":"W", "dist":35},
				{'ns':'N',"deg":85,"min":0, "ew":"E", "dist":18}
				/* {'ns': 'N', 'deg': 20, 'min': 47, 'ew': 'W', 'dist': 1241.90},
				{'ns': 'S', 'deg': 69, 'min': 14, 'ew': 'W', 'dist': 5.75},
				{'ns': 'S', 'deg': 59, 'min': 05, 'ew': 'W', 'dist': 10.93},
				{'ns': 'S', 'deg': 54, 'min': 18, 'ew': 'W', 'dist': 8.31},
				{'ns': 'S', 'deg': 52, 'min': 05, 'ew': 'W', 'dist': 5.45},
				{'ns': 'S', 'deg': 48, 'min': 23, 'ew': 'W', 'dist': 5.51},
				{'ns': 'S', 'deg': 46, 'min': 20, 'ew': 'W', 'dist': 0.91},
				{'ns': 'N', 'deg': 17, 'min': 47, 'ew': 'W', 'dist': 29.72},
				{'ns': 'S', 'deg': 72, 'min': 13, 'ew': 'W', 'dist': 2.30},
				{'ns': 'N', 'deg': 17, 'min': 47, 'ew': 'W', 'dist': 4.95},
				{'ns': 'N', 'deg': 72, 'min': 13, 'ew': 'E', 'dist': 2.30},
				{'ns': 'N', 'deg': 17, 'min': 47, 'ew': 'W', 'dist': 16.30},
				{'ns': 'S', 'deg': 72, 'min': 13, 'ew': 'W', 'dist': 2.30},
				{'ns': 'N', 'deg': 17, 'min': 47, 'ew': 'W', 'dist': 4.95},
				{'ns': 'N', 'deg': 72, 'min': 13, 'ew': 'E', 'dist': 2.30},
				{'ns': 'N', 'deg': 17, 'min': 47, 'ew': 'W', 'dist': 9.34},
				{'ns': 'N', 'deg': 72, 'min': 13, 'ew': 'E', 'dist': 105.30},
				{'ns': 'S', 'deg': 17, 'min': 47, 'ew': 'E', 'dist': 55.31} */
			]
		
		});
		
	},
	rowEditing: function(){
		return Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToMoveEditor: 1,
        autoCancel: false
		});
	},
	//Function for converting the values to points
	tdToPoint: function(startX, startY, heading, degree, minutes, bearing, distance)
	{
		var deg2rad = Math.PI/180;
		var azimuth = degree + (minutes / 60);
	
		ns = heading.toUpperCase();
		ew = bearing.toUpperCase();
	
		if(ns=='N' && ew=='E')
		{
		
		}
		else if(ns=='N' && ew=='W')
		{
			azimuth = 0 - azimuth;
		}
		else if(ns=='S' && ew=='E')
		{
			azimuth = 180 - azimuth;
		}
		else if(ns=='S' && ew=='W')
		{
			azimuth = 180 + azimuth;
		}
		azimuth = azimuth * deg2rad;
	
		var endX = startX + Math.sin(azimuth)*distance;
		var endY = startY + Math.cos(azimuth)*distance;
		var point1 = new OpenLayers.Geometry.Point(endX,endY);
		return point1;
	},
	panelItems: function() {
	
        return[
			{
				xtype: 'textfield',
				itemId: 'longi',
				fieldLabel: 'Longitude',
				anchor: '100%',
				value:'121, 02, 27'//'120, 59, 00.349' 
				//121 02 27
			},
			{
				xtype: 'textfield',
				itemId: 'lati',
				fieldLabel: 'Latitude',
				anchor: '100%',
				value:'14, 32, 08'//'14, 35, 02.568'
				//14 32 08
			},
			
			{
				xtype:'grid',
				title: 'Coordinates',
				anchor:'100% 100%',
				store: this.lagayan(),
				columns: [
					{ header: 'N/S', dataIndex: 'ns', editor: 'textfield', flex:1 },
					{ header: 'Deg', dataIndex: 'deg', editor: 'textfield', flex:1 },
					{ header: 'Min', dataIndex: 'min', editor: 'textfield', flex:1 },
					{ header: 'E/W', dataIndex: 'ew', editor: 'textfield', flex:1 },
					{ header: 'Distance', dataIndex: 'dist', editor: 'textfield', flex:1 }
				],
				tbar: [
				{
					text: 'Add Coordinates',
					handler : function() {
						var me = this.up('TDPlotter');
						var grid = this.up('grid');
						
						var storeKo = grid.getStore();
						var rowEdit = grid.getPlugin('rowEditingPlugin');
						console.log(rowEdit);
						// Create a model instance
						var r = Ext.create('Coordinates', {
							ns: 'NEW'/* ,
							deg: '45',
							min: '60',
							ew: 'W',
							dist: '50' */
							
						});
						
						storeKo.add(r);
						rowEdit.startEdit(grid.getStore().getData().getCount()-1, 0);
						
					}
				},
				/* {
					itemId: 'removeCoordinates',
					text: 'Remove Coordinates',
					handler: function() {
						var sm = this.up('grid').getSelectionModel();
						//console.log(sm);
						rowEditing.cancelEdit();
						lagayan.remove(sm.getSelection());
						if (lagayan.getCount() > 0) {
						sm.select(0);
						}
					},
					disabled: true
				} */],
				//_plugins: [this.up('TDPlotter').rowEditing()],
				plugins: [
						Ext.create('Ext.grid.plugin.RowEditing', {
							pluginId: 'rowEditingPlugin',
							clicksToMoveEditor: 1,
							autoCancel: false
						})
				]/* ,
				listeners: {
					'selectionchange': function(view, records) {
						this.down('#removeCoordinates').setDisabled(!records.length);
					}
				} */
			}
		];
    },
	panelButtons: function(){	
		return [
			{
				text: 'Plot',
				handler: function() {
					//Create a line here
					var line = new OpenLayers.Geometry.LineString();
					
					var meMap = this.up('panel').mapContainer.map;
					var x = meMap.getLayersByName('vectorLayer');
					if(x.length>0)
					{
						x[0].destroy();
					}
					//Get value from the textfield
					var me = this.up('panel');
					var Longi = me.down('textfield[itemId=longi]').getValue().split(',');
					var Lati = me.down('textfield[itemId=lati]').getValue().split(',');
					var longDeg = parseInt(Longi[0]);
					var longMin = parseInt(Longi[1]);
					var longSec = parseInt(Longi[2]);
					var longdd = longDeg + (longMin/60) + (longSec/3600);
					var latiDeg = parseInt(Lati[0]);
					var latiMin = parseInt(Lati[1]);
					var latiSec = parseInt(Lati[2]);
					var latdd = latiDeg + (latiMin/60) + (latiSec/3600);
					console.log(longdd);
					console.log(latdd);
					
					/* if(longDeg || longMin || longSec != 'NaN')
						{
							console.log('Ok lang')
							
						}
					else if(longDeg || longMin || longSec == 'NaN')
						{
							Ext.Msg.alert('Error', 'Value inputted is not a number!');
							var longiText = me.down('textfield[itemId=longi]').setValue('');
							var latiText = me.down('textfield[itemId=lati]').setValue('');
						}; */
						
						
					//Create a point here
					var point1 = new OpenLayers.Geometry.Point(longdd,latdd).transform('EPSG:4326','EPSG:900913');
					
					var myVector = new OpenLayers.Layer.Vector('vectorLayer',{
							styleMap: new OpenLayers.StyleMap({'default':{
							strokeColor: '#9900CC', 
							strokeOpacity: 0.5,
							strokeWidth: 2,
							pointRadius: 5,
							fillColor: '#ff6666'
							}	
							}
						)
					});
					
					//Add the point in the line
					line.addPoint(point1);
					var pointFeature1 = new OpenLayers.Feature.Vector(point1);
					
					//Add the feature of the point to the vector
					myVector.addFeatures([pointFeature1]);
					var prevPoint = point1;
					
					//get the values from the data store
					var ito = this.up('panel');
					//console.log(ito);
					var grid = this.up('panel').down('grid');
					var storeKo = grid.getStore();
					for(var index in storeKo.data.items){
						var row = storeKo.data.items[index];
						var heading = row.get('ns');
						var d = row.get('deg');
						var m = row.get('min');
						var bearing = row.get('ew');
						var dist = row.get('dist');
						
						var bagongTuldok = ito.tdToPoint(prevPoint.x,prevPoint.y,heading,d,m, bearing,dist);
						var pointFeature1 = new OpenLayers.Feature.Vector(bagongTuldok);
						myVector.addFeatures([pointFeature1]);
						line.addPoint(bagongTuldok);
						prevPoint=bagongTuldok;
						
					}
					//Add the line features to the vector
					var lineFeature = new OpenLayers.Feature.Vector(line);
					myVector.addFeatures([lineFeature]);
					
					//Add the created points and line in the map thru layer
					meMap.addLayer(myVector);
					meMap.zoomToExtent(myVector.getDataExtent());
					
				}
			}
		]
	}
});



	/* panelButtons: function(){	
		return [
			{
	            text: 'Plot',
	            handler: function() {
					var me = this.up('PlotKo');
					var Longi = me.down('textfield[itemId=longi]').getValue();
					var Lati = me.down('textfield[itemId=lati]').getValue();
					
					Ext.Ajax.request({
						url: '/user/add',
						method: 'POST',          
						params: {
							longi: Longi,
							lati: Lati
						},
						success: function(response){
							var locaValue = Ext.decode(response.responseText);
							Ext.Msg.alert('Locate', locaValue.locateValue);
							console.log(locaValue.locateValue);
						},
						failure: function(response){
							Ext.Msg.alert('Error', response.status);
							console.log(response.status);
						}
					
					});
					
					
	            }
	   	 	}
		];
	},
	*/
	
