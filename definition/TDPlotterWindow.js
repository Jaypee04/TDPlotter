var myStore = Ext.create('Ext.data.Store', {
	storeId: 'tdStore',
	fields: ['colNS','colDeg', 'colMin', 'colEW', 'colDist'],
	data: [
		{'colNS':'S',"colDeg":10,"colMin":0, "colEW":"W", "colDist":20},
		{'colNS':'N',"colDeg":90,"colMin":0, "colEW":"E", "colDist":40},
		{'colNS':'N',"colDeg":0,"colMin":0, "colEW":"E", "colDist":18},
		{'colNS':'N',"colDeg":90,"colMin":0, "colEW":"E", "colDist":18},
		{'colNS':'S',"colDeg":4,"colMin":0, "colEW":"W", "colDist":40},
		{'colNS':'N',"colDeg":85,"colMin":0, "colEW":"W", "colDist":30},
		{'colNS':'S',"colDeg":2,"colMin":0, "colEW":"W", "colDist":5},
		{'colNS':'N',"colDeg":85,"colMin":0, "colEW":"W", "colDist":16},
		{'colNS':'N',"colDeg":2,"colMin":0, "colEW":"W", "colDist":6},
		{'colNS':'N',"colDeg":85,"colMin":0, "colEW":"W", "colDist":26},
		{'colNS':'N',"colDeg":0,"colMin":0.5, "colEW":"W", "colDist":35},
		{'colNS':'N',"colDeg":85,"colMin":0, "colEW":"E", "colDist":18}
	]
});

Ext.define('myPath.TDPlotterFinalV1', {
	extend: 'Ext.window.Window',
	title: 'TD Plotter',
	alias: 'widget.tdplotter',
	height: 500,
	width:600,
	layout:'fit',
	listeners:{
		close: function()
		{
			var x = this.map.getLayersByName('vectorLayer');
			if(x.length>0)
			{
				x[0].destroy();
			}
		}
	},
	tools:[{
		type: 'restore',
		handler: function(evt, toolEl, owner, tool){
			var window = owner.up('window');
			window.collapse();
			window.setWidth(350);
			window.alignTo(Ext.getBody(), 'bl-bl')
			}
		}
	],
	items:{
		xtype:'panel',
		padding: 10,
		border:false,
		layout:'vbox',
		items: [
			{
				xtype:'panel',
				layout:'hbox',
				items: [
					{
						xtype:'panel',
						padding:10,
						itemId:'panelLat',
						border:false,
						layout:'hbox',
						title:'Latitude',
						items:[
							{
								xtype:'textfield',
								fieldLabel: 'DD:',
								labelWidth: 25,
								width:70,
								value: '14',
								margin: 5,
								itemId: 'LatDD'
							},
							{
								xtype:'textfield',
								fieldLabel: 'MM:',
								labelWidth: 25,
								width:70,
								value: '32',
								margin: 5,
								itemId: 'LatMM'
							},
							{
								xtype:'textfield',
								fieldLabel: 'SS:',
								labelWidth: 25,
								width:90,
								value: '8.12',
								margin: 5,
								itemId: 'LatSS'
							}
						]
					},
					{
						xtype:'panel',
						padding:10,
						itemId:'panelLong',
						border:false,
						layout:'hbox',
						title:'Longitude',
						items:[
							{
								xtype:'textfield',
								fieldLabel: 'DD:',
								labelWidth: 25,
								width:70,
								value: '121',
								margin: 5,
								itemId: 'LongDD'
							},
							{
								xtype:'textfield',
								fieldLabel: 'MM:',
								labelWidth: 25,
								width:70,
								value: '2',
								margin: 5,
								itemId: 'LongMM'
							},
							{
								xtype:'textfield',
								fieldLabel: 'SS:',
								labelWidth: 25,
								width:90,
								value: '27.67',
								margin: 5,
								itemId: 'LongSS'
							}
						]
					}
				]
			},
			{
				xtype:'panel',
				itemId: 'xxx',
				width:'100%',
				items: [
					{
						xtype:'grid',
						title:'Technical Description',
						store: Ext.data.StoreManager.lookup('tdStore'),
						width: '100%',
						height: '100%',
						columns:[
							{ text: 'NS', dataIndex:'colNS'},
							{ text: 'Deg', dataIndex:'colDeg'},
							{ text: 'Min', dataIndex:'colMin'},
							{ text: 'EW', dataIndex:'colEW'},
							{ text: 'Distance', dataIndex:'colDist', flex:1}
						]
					}
				]
			}
		],
		buttons:[
			{
				text:'Add'
			},
			{
				text:'Edit'
			},
			{
				text:'Delete'
			},
			{
				text:'Plot',
				handler: function()
				{
					var line = new OpenLayers.Geometry.LineString();
					var me = this.up('tdplotter');
					var x = me.map.getLayersByName('vectorLayer');
					if(x.length>0)
					{
						x[0].destroy();
					}
					var latdeg = parseInt(me.down('#LatDD').getValue());
					var latmin = parseInt(me.down('#LatMM').getValue());
					var latsec = parseInt(me.down('#LatSS').getValue());
					var latdd = latdeg + (latmin/60) + (latsec/3600);
					var longdeg = parseInt(me.down('#LongDD').getValue());
					var longmin = parseInt(me.down('#LongMM').getValue());
					var longsec = parseInt(me.down('#LongSS').getValue());
					var longdd = longdeg + (longmin/60) + (longsec/3600);
					
					var wgsProjection = new OpenLayers.Projection('EPSG:4326');
					var mercatorProjection = new OpenLayers.Projection('EPSG:900913');
					
					var p = new OpenLayers.Geometry.Point(longdd,latdd).transform(wgsProjection,mercatorProjection);
					
					var vectorLayer = new OpenLayers.Layer.Vector("vectorLayer");
					var style = {
						strokeColor: '#0000ff',
						strokeWidth:2
					};
					
					line.addPoint(p);
					var ref = new OpenLayers.Feature.Vector(p, null);
					vectorLayer.addFeatures([ref]);
					var prevPoint = p;
					
					myStore.each(function(row)
					{
						var heading = row.get('colNS');
						var d = row.get('colDeg');
						var m = row.get('colMin');
						var bearing = row.get('colEW');
						var dist = row.get('colDist');
						
						var newPoint = tdToPoint(prevPoint.x,prevPoint.y,heading,d,m, bearing,dist)
						var ref = new OpenLayers.Feature.Vector(newPoint);
						vectorLayer.addFeatures([ref]);
						line.addPoint(newPoint);
						prevPoint=newPoint;
					})
					
					var lineFeature = new OpenLayers.Feature.Vector(line, null, style);
					vectorLayer.addFeatures([lineFeature]);
					
					me.map.addLayer(vectorLayer);
					me.map.zoomToExtent(vectorLayer.getDataExtent());
				}
			}
		]
	}
});

function tdToPoint(startX, startY, heading, degree, minutes, bearing, distance)
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
	var p = new OpenLayers.Geometry.Point(endX,endY);
	return p;
}
	