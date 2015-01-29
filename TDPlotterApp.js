Ext.Loader.setConfig({ disableCaching:false });

(function() {
    Ext.Loader.setConfig({
        enabled: true,
        paths: {
            myPath:'/definition'
        } 
    });
	//Ext.require('myPath.TDPlotterDefinition');
	Ext.application({
		name   : 'Locate',
		requires: ['myPath.TDPlotterDefinition','myPath.MapPanelDefinition','myPath.MapComposerDefinition'],
		launch : function() {
			var mapPanel = Ext.create('myPath.MapPanelDefinition',{});
			Ext.create('Ext.container.Viewport', {
			id: 'viewport',
		    layout: 'border',
			
			items: [
				
				
				{
					xtype:'TDPlotter',
					title: 'Technical Description Plotter',
					frame: true,
					split: true,
					region:'west',
					layout:'anchor',
					collapsible:true,
					collapsed:true,
					width    : 490,
					bodyPadding  : 10,
					mapContainer:mapPanel
					
				},/* ,
				{
					xtype:'panel',
					title: 'Map Composer',
					frame: true,
					split: true,
					region:'east',
					layout:'anchor',
					collapsible:true,
					bodyPadding  : 10,
					width : 180,
					height: 300,
					items:[{
						xtype: 'button',
						name: 'go',
						text: 'Launch Map Composer',
				
						handler:function(){
							Ext.create('myPath.MapComposerDefinition', {
								mapContainer:mapPanel
							}).show();
						}
					}]
					
				}, */
				/* {
					xtype:'Routing',
					title: 'Routing App',
					frame: true,
					split: true,
					region:'east',
					layout:'anchor',
					collapsible:true,
					bodyPadding  : 10,
					width    : 250,
					hidden:true,
					mapContainer:mapPanel
				}, */
				mapPanel
			]
			
		});
		}
		
	});

})();

