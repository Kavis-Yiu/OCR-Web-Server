<?php
// re-fine the OCR result
function AUTOCASH($ocrDocs) {
	// check the image OCR result
	if (!count($ocrDocs)) {
		return null;
	}

	// set the default output data
	$output = [
		'printDate' => null,
		'batchID' => null,
		'accountNo' => null,
		'txType' => null,
		'batchName' => null,
		'postingDate' => null,
		'totalEntry' => null,
		'totalAmount' => null,
		'filename' => null,
		'entries' => []
	];

	// set the regex
	$rgx = [
		'printDate' => ['/(print ?date)/i', '/((\d\d\/){2}\d{4}( ?(\d\d:){2}\d\d)?)/'],
		'batchID' => ['/(batch id)/i', '/(\w+)/'],
		'accountNo' => ['/(originating account no)/i', '/((\d{3}\D){2}\d+)/'],
		'txType' => ['/(transaction type)/i', '/([\w\s]+)/'],
		'batchName' => ['/(batch name)/i', '/([\w\s\-]+)/'],
		'postingDate' => ['/(posting date)/i', '/((\d\d\/){2}\d{4})/'],
		'totalEntry' => ['/(total entries)/i', '/((\d{1,3} *,? *)*\d{1,3})/'],
		'totalAmount' => ['/(total amount)/i', '/((\d{1,3} *,? *)*\d{1,3}\.\d{2})/'],
		'filename' => ['/(file name)/i', '(\w+\. ?\w+)'],
		'accoutName' => ['/(account name)/i', '/([a-z\w]+)/i'],
		'accoutNumber' => ['/(account number)/i', '/((\d{3}\D){2}\d+)/'],
		'amount' => ['/(amount)/i', '/((\d{1,3} *,? *)*\d{1,3}\.\d{2})/'],
		'reference' => ['/(reference)/i', '/([\.\w]+)/'],
		'end' => '/(end ?of ?report)/i'
	];

	$ocrDocs = array_reverse($ocrDocs);
	foreach ($ocrDocs as $ocrDoc) {
		// find out the ledger starting line
		$m = [-1, 0, 0, 0];
		$b = [-1, count($ocrDoc['doc'])-1];
		$k = array_keys($ocrDoc['doc']);
		while ($b[0]++ < $b[1]) {
			// find out the columns
			for ($i = count($ocrDoc['doc'][$k[$b[0]]]) - 1; $i >= 0; --$i) {
				$r = $ocrDoc['doc'][$k[$b[0]]][$i];

				if (!$m[3]) {
					// match the column: reference
					if ($i > $m[2] && preg_match($rgx['reference'][0], $r['t'])) {
						$m[3] = $i;
					}
				}
				else if (!$m[2]) {
					// match the column: amount
					if ($i > $m[1] && preg_match($rgx['amount'][0], $r['t'])) {
						$m[2] = $i;
					}
				}
				else if (!$m[1]) {
					// match the column: accout number
					if ($i > $m[0] && preg_match($rgx['accoutNumber'][0], $r['t'])) {
						$m[1] = $i;
					}
				}
				else if ($m[0] < 0) {
					// match the column: accout name
					if (preg_match($rgx['accoutName'][0], $r['t'])) {
						$m[0] = $i;
						break;
					}
				}
			}

			// matched accout name & accout number & amount & reference
			if ($m[0] > -1) {
				break;
			}
		}

		// determine if the starting line is found
		if ($m[0] < 0 || strpos(implode('', $m), '00') !== false) {
			return $output;
		}

		// set the columns position constraints
		$r = $ocrDoc['doc'][$k[$b[0]]];
		$opt = [
			'accoutName' => [$r[$m[0]]['x'], $r[$m[1]]['x']],
			'accoutNumber' => [$r[$m[1]]['x'], $r[$m[2]]['x']],
			'amount' => [$r[$m[1]]['x'] + $r[$m[1]]['w'], $r[$m[2]]['x'] + $r[$m[2]]['w']],
			'reference' => $r[$m[2]]['x'] + $r[$m[2]]['w']
		];

		// extract the entries from bottom
		while ($b[1] > $b[0]) {
			$entry = ['', '', '', ''];

			foreach ($ocrDoc['doc'][$k[$b[1]]] as $term) {
				// calc the term's middle point
				$c = $term['x'] + ($term['w'] >> 1);

				// account name
				if ($opt['accoutName'][0] <= $c && $c <= $opt['accoutName'][1] && preg_match($rgx['accoutName'][1], $term['t'])) {
					$entry[0] = trim($term['t']);
				}

				// account number
				if ($opt['accoutNumber'][0] <= $c && $c <= $opt['accoutNumber'][1] && preg_match($rgx['accoutNumber'][1], preg_replace('/\s/', '', $term['t']))) {
					$entry[1] = trim(preg_replace('/[^\d]/', '-', $m[0]));
					$entry[1] = trim($term['t']);
				}

				// amount
				$r = str_replace(' ', '', str_replace('oo', '00', $term['t']));
				if ($opt['amount'][0] <= $c && $c <= $opt['amount'][1] && preg_match($rgx['amount'][1], $r, $m)) {
					$entry[2] = floatval(str_replace(',', '', $m[0]));
				}

				// reference
				if ($opt['reference'][0] <= $c && preg_match($rgx['reference'][1], $term['t'], $m)) {
					$entry[3] = trim($m[0]);
				}
			}

			if (!empty(implode('', $entry))) {
				$output['entries'][] = $entry;
			}

			--$b[1];
		}

		// extract the headers from bottom
		while (--$b[0] >= 0) {
			$header = '';

			foreach ($ocrDoc['doc'][$k[$b[0]]] as $term) {
				if (!$header && preg_match($rgx['filename'][0], $term['t'])) {
					$header = 'filename';
				}
				else if ($header == 'filename' && preg_match($rgx['filename'][1], $term['t'], $m)) {
					$output['filename'] = trim(str_replace(' ', '', $m[0]));
				}

				if (!$header && preg_match($rgx['totalAmount'][0], $term['t'])) {
					$header = 'totalAmount';
				}
				else if ($header == 'totalAmount' && preg_match($rgx['totalAmount'][1], $term['t'], $m)) {
					$output['totalAmount'] = floatval(preg_replace('/[,\s]/', '', $m[0]));
				}

				if (!$header && preg_match($rgx['totalEntry'][0], $term['t'])) {
					$header = 'totalEntry';
				}
				else if ($header == 'totalEntry' && preg_match($rgx['totalEntry'][1], $term['t'], $m)) {
					$output['totalEntry'] = intval(preg_replace('/[,\s]/', '', $m[0]));
				}

				if (!$header && preg_match($rgx['postingDate'][0], $term['t'])) {
					$header = 'postingDate';
				}
				else if ($header == 'postingDate' && preg_match($rgx['postingDate'][1], $term['t'], $m)) {
					$output['postingDate'] = trim(str_replace(' ', '', $m[0]));
				}

				if (!$header && preg_match($rgx['batchName'][0], $term['t'])) {
					$header = 'batchName';
				}
				else if ($header == 'batchName' && preg_match($rgx['batchName'][1], $term['t'], $m)) {
					$output['batchName'] = trim($m[0]);
				}

				if (!$header && preg_match($rgx['txType'][0], $term['t'])) {
					$header = 'txType';
				}
				else if ($header == 'txType' && preg_match($rgx['txType'][1], $term['t'], $m)) {
					$output['txType'] = trim($m[0]);
				}

				if (!$header && preg_match($rgx['accountNo'][0], $term['t'])) {
					$header = 'accountNo';
				}
				else if ($header == 'accountNo' && preg_match($rgx['accountNo'][1], preg_replace('/\s/', '', $term['t']), $m)) {
					$output['accountNo'] = trim(preg_replace('/[^\d]/', '-', $m[0]));
				}

				if (!$header && preg_match($rgx['batchID'][0], $term['t'])) {
					$header = 'batchID';
				}
				else if ($header == 'batchID' && preg_match($rgx['batchID'][1], $term['t'], $m)) {
					$output['batchID'] = trim($m[0]);
				}

				if (!$header && preg_match($rgx['printDate'][0], $term['t'])) {
					$header = 'printDate';
				}
				else if ($header == 'printDate' && preg_match($rgx['printDate'][1], $term['t'], $m)) {
					$output['printDate'] = trim($m[0]);
				}
			}
		}
	}

	if (preg_match($rgx['end'], implode('', $output['entries'][0]))) {
		array_shift($output['entries']);
	}

	$output['entries'] = array_reverse($output['entries']);

	return $output;//$ocrDoc['doc'];//
}