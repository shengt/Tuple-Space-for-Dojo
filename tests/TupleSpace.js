dojo.provide("nz.ac.auckland.tests.TupleSpace");

dojo.require("nz.ac.auckland.tupleSpace.manager");

(function() {
	var ts = nz.ac.auckland.tupleSpace, 
		tsm = nz.ac.auckland.tupleSpace.manager, 
		tupleSpace = tsm.getTupleSpace();
	
	doh.register("nz.ac.auckland.tests.tupleSpace", [
		
		{
			name: "Tuple Space: Match Tuple",
			setUp: function(){
		    },
	 		runTest: function(t){
				var tuple = new ts.Tuple("src_1", null, "Hello world!", "topic1");
				var tupleTemplate = new ts.TupleTemplate("%%", "%%", "%%", "topic1");
	 			t.assertTrue(tupleTemplate.match(tuple));
			},
			tearDown: function(){
			}
		},
		
	    {
			name: "Tuple Space: Write",
			setUp: function(){
				tupleSpace.reset();
		    },
	 		runTest: function(t){
	 			var tuple = new ts.Tuple("src_1", null, "Hello world!", "topic1");
		    	tupleSpace.write(tuple, function(tuple1, error) {
		    		t.assertFalse(error);
		    		t.assertEqual(tuple.uuid, tuple1.uuid);
		    		t.assertEqual(1, tupleSpace.size());
		    	});
		    	
		    	tuple = new ts.Tuple("src_2", null, "Hello world!", "topic1");
		    	tupleSpace.write(tuple, function(tuple2, error) {
		    		t.assertFalse(error);
		    		t.assertEqual(tuple.uuid, tuple2.uuid);
		    		t.assertEqual(2, tupleSpace.size());
		    	});
			},
			tearDown: function(){
				tupleSpace.reset();
			}
		},
		
		{
			name: "Tuple Space: Blocking Read",
			setUp: function(){
				tupleSpace.reset();
				
				var tuple = new ts.Tuple("src_1", null, "Hello world!", "topic1");
				tupleSpace.write(tuple);
		    },
	 		runTest: function(t){
	 			// Read when the tuple exists.
	 			var tupleTemplate = new ts.TupleTemplate("%%", "%%", "%%", "topic1");
	 			tupleSpace.read(tupleTemplate, function(tuples, error) {
					t.assertFalse(error);
					t.assertEqual(1, tupleSpace.size());	// Not taken
					t.assertTrue(dojo.isArray(tuples));
					t.assertEqual(1, tuples.length);
					t.assertTrue(tupleTemplate.match(tuples[0]));
		    	});
	 			
	 			// Read when the tuple does not exist. It will be blocked util tuple available.
	 			var tupleTemplate1 = new ts.TupleTemplate("%%", "%%", "%%", "topic9");
	 			tupleSpace.read(tupleTemplate1, function(tuples, error) {
	 				t.assertFalse(error);
	 				t.assertTrue(dojo.isArray(tuples));
	 				t.assertTrue(tupleTemplate1.match(tuples[0]));
	 			});

	 			var tuple1 = new ts.Tuple("src_2", null, "Hello world!", "topic9");
	 			tupleSpace.write(tuple1);
	 			
			},
			tearDown: function(){
				tupleSpace.reset();
			}
		},
	    
		{
			name: "Tuple Space: Blocking Take",
			setUp: function(){
				tupleSpace.reset();
				
				var tuple = new ts.Tuple("src_1", null, "Hello world!", "topic1");
				tupleSpace.write(tuple);
		    },
	 		runTest: function(t){
	 			// Read when the tuple exists.
	 			var tupleTemplate = new ts.TupleTemplate("%%", "%%", "%%", "topic1");
	 			tupleSpace.take(tupleTemplate, function(tuples, error) {
					t.assertFalse(error);
					t.assertEqual(0, tupleSpace.size());	// Taken
					t.assertTrue(dojo.isArray(tuples));
					t.assertEqual(1, tuples.length);
					t.assertTrue(tupleTemplate.match(tuples[0]));
		    	});
	 			
	 			// Read when the tuple does not exist. It will be blocked util tuple available.
	 			var tupleTemplate1 = new ts.TupleTemplate("%%", "%%", "%%", "topic9");
	 			tupleSpace.take(tupleTemplate1, function(tuples, error) {
	 				t.assertFalse(error);
	 				t.assertEqual(0, tupleSpace.size());	// taken
	 				t.assertTrue(dojo.isArray(tuples));
	 				t.assertTrue(tupleTemplate1.match(tuples[0]));
	 			});

	 			t.assertEqual(0, tupleSpace.size());
	 			var tuple1 = new ts.Tuple("src_2", null, "Hello world!", "topic9");
	 			tupleSpace.write(tuple1);
	 			//t.assertEqual(1, tupleSpace.size());		// Not taken
				
			},
			tearDown: function(){
				tupleSpace.reset();
			}
		},
	    
		{
			name: "Tuple Space: Non-blocking Read",
			setUp: function(){
				tupleSpace.reset();
				
				var tuple = new ts.Tuple("src_1", null, "Hello world!", "topic1");
				tupleSpace.write(tuple, function(tuple1, error) {
					doh.assertFalse(error);
		    	});
		    },
	 		runTest: function(t){
	 			// Read when the tuple exists.
	 			var tupleTemplate = new ts.TupleTemplate("%%", "%%", "%%", "topic1");
	 			tupleSpace.readp(tupleTemplate, function(tuples, error) {
					t.assertFalse(error);
					t.assertEqual(1, tupleSpace.size());	// Not taken
					t.assertTrue(dojo.isArray(tuples));
					t.assertEqual(1, tuples.length);
					t.assertTrue(tupleTemplate.match(tuples[0]));
		    	});
	 			
	 			// Read when the tuple does not exist. It will be blocked util tuple available.
	 			var tupleTemplate1 = new ts.TupleTemplate("%%", "%%", "%%", "topic9");
	 			tupleSpace.readp(tupleTemplate1, function(tuples, error) {
	 				// return immediately
	 				t.assertFalse(error);
	 				t.assertTrue(dojo.isArray(tuples));
	 				t.assertEqual(0, tuples.length);
	 			});
	 			/*
	 			var tuple1 = new ts.Tuple("src_2", null, "Hello world!", "topic9");
	 			tupleSpace.write(tuple1);
	 			 */			 			
			},
			tearDown: function(){
				tupleSpace.reset();
			}
		},
	    
		{
			name: "Tuple Space: Non-blocking Take",
			setUp: function(){
				tupleSpace.reset();
				
				var tuple = new ts.Tuple("src_1", null, "Hello world!", "topic1");
				tupleSpace.write(tuple, function(tuple1, error) {
					doh.assertFalse(error);
		    	});
		    },
	 		runTest: function(t){

	 			// Read when the tuple exists.
	 			var tupleTemplate = new ts.TupleTemplate("%%", "%%", "%%", "topic1");
	 			tupleSpace.takep(tupleTemplate, function(tuples, error) {
	 				t.assertFalse(error);
					t.assertEqual(0, tupleSpace.size());	// taken
					t.assertTrue(dojo.isArray(tuples));
					t.assertEqual(1, tuples.length);
					t.assertTrue(tupleTemplate.match(tuples[0]));
		    	});
	 			
	 			// Read when the tuple does not exist. It will be blocked util tuple available.
	 			var tupleTemplate1 = new ts.TupleTemplate("%%", "%%", "%%", "topic9");
	 			tupleSpace.takep(tupleTemplate1, function(tuples, error) {
	 				// return immediately
	 				t.assertFalse(error);
	 				t.assertTrue(dojo.isArray(tuples));
	 				t.assertEqual(0, tuples.length);
	 			});
	 			/*
	 			var tuple1 = new ts.Tuple("src_2", null, "Hello world!", "topic9");
	 			tupleSpace.write(tuple1);
	 			 */			 		
			},
			tearDown: function(){
				tupleSpace.reset();
			}
		}
	]);
	
})();