Ext.define('myPath.MapComposerDefinition', {
	extend: 'Ext.window.Window',
	title: 'Map Composer',
	alias: 'widget.MapComposer',
	height: 200,
	width:450,
	layout:'fit',
	mapContainer:'',
	/* listeners:{
		close: function()
		{
			var meMap = this.mapContainer.map;
			console.log(meMap);
			var x = meMap.getLayersByName('vectorLayer');
			if(x.length>0)
			{
				x[0].destroy();
			}
			
		}
	}, */
	tools:[{
		type: 'restore',
		handler: function(evt, toolEl, owner, tool){
			var window = owner.up('window');
			window.collapse();
			window.setWidth(450);
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
						itemId:'panelUp',
						border:false,
						layout:'hbox',
						width: 415,
						title:'Upload a layer file',
						items:[
							/* {
								xtype:'textfield',
								margin:5,
								fieldLabel: 'File Path:',
								itemId: 'fPath'
							},
							{
								xtype:'button',
								margin:5,
								text:'Browse',
								handler: function()
								{
									var me = this.up('panel').up('panel').up('window').down('Upload');
									console.log(me);
									//me.disabled = false;
								}
							} */
							{
								xtype: 'fileuploadfield',
								id: 'filedata',
								margin:5,
								emptyText: 'Select a document to upload...',
								fieldLabel: 'File Path',
								width:370,
								buttonText: 'Browse'
							}
						]
					}
					
				]
			}
		],
		buttons:[
			{
				text:'Upload',
				itemId:'btnUpload',
				handler: function()
				{
					var me = this.up('window').mapContainer.map;
					console.log(me);
					var p = Ext.create('Ext.ProgressBar', {
					width: 300
					});

					// Wait for 5 seconds, then update the status el (progress bar will auto-reset)
					p.wait({
						interval: 500,
						//bar will move fast!
						duration: 50000,
						increment: 15,
						text: 'Updating...',
						scope: this,
						fn: function () {
						p.updateText('Done!');
						}
					});
					//Ext.MessageBox.alert('File Uploaded', 'Uploaded successfully!');
					var myNewLayer = new OpenLayers.Layer.Vector('vectorLayer', {
						projection: new OpenLayers.Projection('EPSG:4326'),
						strategies: [new OpenLayers.Strategy.Fixed()],
						protocol: new OpenLayers.Protocol.HTTP({
							url: "/kml/wildlife-national-parks-philippines.kml",
							format: new OpenLayers.Format.KML({
								extractStyles: true, 
								extractAttributes: true,
								maxDepth: 2
							})
						})
					});
					me.addLayer(myNewLayer);
					this.up('window').close();
				}
			},
			{
				text:'Display',
				disabled:true,
				itemId:'btnDisplay',
				handler: function()
				{
					var line = new OpenLayers.Geometry.LineString();
					var me = this.up('MapComposer');
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