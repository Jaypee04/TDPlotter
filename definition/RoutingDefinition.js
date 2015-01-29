Ext.define('myPath.RoutingDefinition', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.Routing',
	frame:true,
	layout:'anchor',
    width    : 490,
    bodyPadding  : 10,
	mapContainer:'',
	initComponent : function() {
		// initialize UI
        this.items = this.panelItems();
		this.buttons = this.panelButtons();
		
		// must always be called
        this.callParent(arguments);
    },
	
	panelItems: function() {
	
        return[
			{
				xtype: 'textfield',
				itemId: 'location',
				fieldLabel: 'Location',
				anchor: '100%',
				
			},
			{
				xtype: 'textfield',
				itemId: 'destination',
				fieldLabel: 'Destination',
				anchor: '100%',
				
			}
			
			
		];
    },
	geoCode: function(address, callback){
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode( { 'address': address }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK)
		{
			var x = results[0].geometry.location.lng();
			var y = results[0].geometry.location.lat();
			//console.log(x + ' ' +y);
			geo = {
				a:x,
				b:y
			}
			
		}
		else 
		{
			alert('Geocode was not successful for the following reason: ' + status);
		}
		callback(geo);
	});	
	},
	
	
	panelButtons: function(){	
		return [
			{
				text: 'Plot',
				handler: function() {
					var meMap = this.up('panel').mapContainer.map;
					var x = meMap.getLayersByName('vectorLayer');
					if(x.length>0)
					{
						x[0].destroy();
					}
					
					
					var loc = this.up('panel').down('textfield[itemId=location]').getValue();
					var dest = this.up('panel').down('textfield[itemId=destination]').getValue();

					var myVector = new OpenLayers.Layer.Vector('vectorLayer',{
							styleMap: new OpenLayers.StyleMap({'default':{
							strokeColor: '#9900CC', 
							strokeOpacity: 0.5,
							strokeWidth: 2,
							pointRadius: 5,
							fillColor: '#ff6666'
							}}
							)
					});
					var gc = this.up('panel');
					//console.log(gc);
					gc.geoCode(loc, function(result1){										
					var loca = new OpenLayers.Geometry.Point(result1.a,result1.b).transform('EPSG:4326','EPSG:900913');											
						gc.geoCode(dest, function(result2){
							var desti = new OpenLayers.Geometry.Point(result2.a,result2.b).transform('EPSG:4326','EPSG:900913');						
							myVector.addFeatures([new OpenLayers.Feature.Vector(loca),new OpenLayers.Feature.Vector(desti)]);						  						 	
						});		
					console.log(result1);//+ ' ' + dest);
					}); 
					
					//Add the created points and line in the map thru layer
					meMap.addLayer(myVector);
					meMap.zoomToMaxExtent();
					
					
					
				}
			}
		]
	}
});
