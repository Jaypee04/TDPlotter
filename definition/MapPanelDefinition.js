Ext.define('myPath.MapPanelDefinition', {
	extend: 'Ext.panel.Panel',
    alias: 'widget.MapPanel',
	title: "Map",
	layout: 'fit',
	region:'center',
	showHeader: false,
	initComponent : function() {
		// initialize UI
		this.on('afterrender', function(){
			var wh = this.ownerCt.getSize();
			Ext.applyIf(this, wh);
			var myMap = new OpenLayers.Layer.NAMRIA(
				'NAMRIA Basemap',
				'http://202.90.149.252/ArcGIS/rest/services/Basemap/PGS_Basemap/MapServer',
				{
					isBaseLayer: true
				}
			);
			this.map = new OpenLayers.Map(
				// render the map to the body of this panel
				this.body.dom.id,
				{ 
					controls: [
						new OpenLayers.Control.Navigation(),
						new OpenLayers.Control.LayerSwitcher(),
						new OpenLayers.Control.Zoom()
					],
					fallThrough: true,
					projection: 'EPSG:900913'
				}
			);
			this.map.addLayers([myMap]);
			//this.map.setCenter(new OpenLayers.LonLat(13668910.62451, 1571632.8921), 1);
			this.map.zoomToMaxExtent();	
		});
		//Resize
		this.on('resize', function(){
			var size = [document.getElementById(this.id + "-body").offsetWidth, document.getElementById(this.id + "-body").offsetHeight];
			this.map.updateSize(size);
		});
		this.callParent();
	}
});