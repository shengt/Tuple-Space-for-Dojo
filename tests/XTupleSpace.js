dojo.provide("nz.ac.auckland.tests.XTupleSpace");

dojo.require("nz.ac.auckland.tupleSpace.manager");

(function() {
	var ts = nz.ac.auckland.tupleSpace, 
		tsm = nz.ac.auckland.tupleSpace.manager, 
		xTupleSpace = tsm.getXTupleSpace();
	
	doh.register("nz.ac.auckland.tests.XTupleSpace", [
		{
			name: "X Tuple Space: Matching",
			runTest: function(t) {
				var tuple = new ts.XTuple("src_1", null, "Hello world!", "topic1");
				var tupleTemplate = new ts.XTupleTemplate("%%", "%%", "%%", "topic1"),
					tupleTemplate1 = new ts.XTupleTemplate("%%", "%%", "%%", "topic9"),
					tupleTemplate2 = new ts.XTupleTemplate("src_1", "%%", null, "");
	 			t.assertTrue(tupleTemplate.match(tuple));
				t.assertFalse(tupleTemplate1.match(tuple));
				t.assertFalse(tupleTemplate2.match(tuple));
			}
		},
		
	    {
			name: "X Tuple Space: Blocking Read Unmarked",
			setUp: function(){
				xTupleSpace.reset();
				
				var tuple = new ts.XTuple("src_1", null, "Hello world!", "topic1");
				xTupleSpace.write(tuple);
				var tuple1 = new ts.XTuple("src_2", null, "Hello world!", "topic1");
				xTupleSpace.write(tuple1);
		    },
	 		runTest: function(t){
				var def = new doh.Deferred();
				
				var tupleTemplate = new ts.XTupleTemplate("%%", "%%", "%%", "topic1");
				var tuple1Id = null, tuple2Id = null, tuple3Id = null;
				xTupleSpace.read(tupleTemplate, function(tuples1, error) {
					tuple1Id = tuples1[0].uuid;
				});
				xTupleSpace.read(tupleTemplate, function(tuples2, error) {
				    tuple2Id = tuples2[0].uuid;
				});
			    xTupleSpace.read(tupleTemplate, function(tuples3, error) {
			        tuple3Id = tuples3[0].uuid;
			    });
				t.assertNotEqual(tuple1Id, tuple2Id);
				t.assertTrue(!!tuple3Id);         // Test looped reading
				def.callback(true);
				
				return def;
			},
			tearDown: function(){
				xTupleSpace.reset();
			}
		},
		
		{
			name: "X Tuple Space: Blocking Read Latest",
			setUp: function(){
				xTupleSpace.reset();
				
				var tuple = new ts.XTuple("src_1", null, "Hello world!", "topic1");
				xTupleSpace.write(tuple);
				
				var tuple1 = new ts.XTuple("src_2", null, "Hello world!", "topic1");
				xTupleSpace.write(tuple1);
		    },
	 		runTest: function(t){
				var def = new doh.Deferred();
				
				var tupleTemplate = new ts.XTupleTemplate("%%", "%%", "%%", "topic1");
				xTupleSpace.readLatest(tupleTemplate, function(tuples, error) {
					t.assertEqual("src_2", tuples[0].sourceId);
					def.callback(true);
				});
				
				return def;
			},
			tearDown: function(){
				xTupleSpace.reset();
			}
		},
		
		{
			name: "X Tuple Space: Blocking Take Latest",
			setUp: function(){
				xTupleSpace.reset();
				
				var tuple = new ts.XTuple("src_1", null, "Hello world!", "topic1");
				xTupleSpace.write(tuple);
				
				var tuple1 = new ts.XTuple("src_2", null, "Hello world!", "topic1");
				xTupleSpace.write(tuple1);
		    },
	 		runTest: function(t){
				var def = new doh.Deferred();
				
				var tupleTemplate = new ts.XTupleTemplate("%%", "%%", "%%", "topic1");
				xTupleSpace.takeLatest(tupleTemplate, function(tuples, error) {
					t.assertEqual("src_2", tuples[0].sourceId);
					def.callback(true);
				});
				
				return def;
			},
			tearDown: function(){
				xTupleSpace.reset();
			}
		},
		
		{
			name: "X Tuple Space: Read Later Than",
			setUp: function(){
				xTupleSpace.reset();
				
				var tuple = new ts.XTuple("src_1", null, "Hello world!", "topic1");
				xTupleSpace.write(tuple);
				
				var tuple1 = new ts.XTuple("src_2", null, "Hello world!", "topic2");
				xTupleSpace.write(tuple1);
		    },
	 		runTest: function(t){
				var def = new doh.Deferred();
	        	
				var handler = window.setTimeout(function() {
					window.clearTimeout(handler);
					
					var tupleTemplate = new ts.XTupleTemplate("%%", "%%", "%%", "topic1", 
								nz.ac.auckland.tupleSpace.utils.getTimeStamp());
					xTupleSpace.readLater(tupleTemplate, function(tuples, error) {
						t.assertEqual("src_3", tuples[0].sourceId);
						def.callback(true);
					});
					
					var tuple2 = new ts.XTuple("src_3", null, "Hello world!", "topic1");
					xTupleSpace.write(tuple2);
				}, 1000);
				
				return def;
			},
			tearDown: function(){
				xTupleSpace.reset();
			}
		}
	]);
})();