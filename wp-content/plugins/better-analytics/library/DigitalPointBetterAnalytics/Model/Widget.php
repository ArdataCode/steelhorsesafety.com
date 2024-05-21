<?php

class DigitalPointBetterAnalytics_Model_Widget
{
	public static function getRealtimeData($secondsToCache = 300, $returnData = false)
	{
		$betterAnalyticsOptions = get_option('better_analytics');
		if (DigitalPointBetterAnalytics_Base_Public::getInstance()->getTokens() && @$betterAnalyticsOptions['api']['profile'])
		{
			$reportingObject = DigitalPointBetterAnalytics_Helper_Reporting::getInstance();
			$cacheKey = $reportingObject->getRealtime('rt:activeUsers', 'rt:source,rt:medium,rt:referralPath,rt:pagePath,rt:deviceCategory,rt:country,rt:keyword');
			$data = $reportingObject->getResults($cacheKey);

			$realTimeOutput = array('users' => intval(@$data['totalsForAllResults']['rt:activeUsers']));
			if ($data['rows'])
			{
				foreach ($data['rows'] as $row)
				{
					if (strlen($row[1]) < 4)
					{
						$medium = strtoupper($row[1]);
					}
					else
					{
						$medium = ucwords(strtolower($row[1]));
					}

					$realTimeOutput['medium'][$medium] += $row[7];

					if ($row[1] == 'REFERRAL')
					{
						$realTimeOutput['referral_path'][$row[0] . $row[2]] += $row[7];
					}
					$realTimeOutput['page_path'][$row[3]] += $row[7];

					$deviceCategory = ucwords(strtolower($row[4]));

					$realTimeOutput['devices'][$deviceCategory] += $row[7];
					$realTimeOutput['country'][$row[5]] += $row[7];
					if ($row[1] == 'ORGANIC')
					{
						$keywords = trim(strtolower($row[6]));
						$realTimeOutput['keywords'][$keywords] += $row[7];
					}
				}

				foreach ($realTimeOutput as &$array)
				{
					if (is_array($array))
					{
						arsort($array);
					}
				}
			}

			set_transient('ba_realtime', $realTimeOutput, $secondsToCache);

			if ($returnData)
			{
				return $realTimeOutput;
			}
		}


	}

	public static function getStatsWidgetData($settings = null)
	{
		if (!$settings)
		{
			$statsWidget = new DigitalPointBetterAnalytics_Widget_Stats();
			$settings = $statsWidget->get_settings();
		}

		if ($settings)
		{
			$cacheKeys = array();

			foreach ($settings as $setting)
			{
				if (empty($setting['this_page_only']))
				{
					$cacheKeys[] = self::getStatsWidgetStart($setting);
				}

			}

			if ($cacheKeys)
			{
				foreach ($cacheKeys as $cacheKey)
				{
					self::getStatsWidgetEnd($setting, $cacheKey);
				}
			}
		}
	}

	public static function getStatsWidgetStart($setting, $uri = '')
	{
		if (!$uri)
		{
			$uri = $_SERVER['REQUEST_URI'];
		}

		$split = explode('|', $setting['metric']);

		if ($timeZoneString = get_option('timezone_string'))
		{
			$timeZoneString = 'GMT';
		}
		$timeZone = new DateTimeZone($timeZoneString);

		$date = new DateTime('now', $timeZone);
		$date->sub(new DateInterval('P' . intval($setting['days'] + 1) . 'D'));
		$startDate = $date->format('Y-m-d');

		$date = new DateTime();
		$date->sub(new DateInterval('P1D'));
		$endDate = $date->format('Y-m-d');

		$dimensionFilter = array();

		if (!empty($setting['this_page_only']))
		{
			$dimensionFilter[] = array (
				'operator' => 'AND',
				'filters' => array(
					array(
						'dimensionName' => 'ga:pagePath',
						'operator' => 'EXACT',
						'expressions' => $uri
					)
				)
			);
		}


		if (!empty($split[1]))
		{
			if (empty($dimensionFilter))
			{
				$dimensionFilter[] = array(
					'operator' => 'AND',
					'filters' => array()
				);
			}

			$filtersRaw = explode(';', $split[1]);

			foreach($filtersRaw as $filterRaw)
			{
				$splitFilter = explode('==', $filterRaw);

				$dimensionFilter[0]['filters'][] = array(
					'dimensionName' => $splitFilter[0],
					'operator' => 'EXACT',
					'expressions' => array($splitFilter[1])
				);
			}
		}



		return DigitalPointBetterAnalytics_Helper_Reporting::getInstance()->getData(
			$startDate,
			$endDate,
			array( // metric
				array(
					'expression' => $split[0]
				)
			),
			array(), // dimensions
			array(), // sort
			$dimensionFilter // dimension filters
		);
	}

	public static function getStatsWidgetEnd($setting, $cacheKey, $uri = '')
	{
		if (!$uri)
		{
			$uri = $_SERVER['REQUEST_URI'];
		}

		$results = DigitalPointBetterAnalytics_Helper_Reporting::getInstance()->getResults($cacheKey);

		$value = intval(@$results['reports'][0]['data']['rows'][0]['metrics'][0]['values'][0]);

		set_transient(
			'ba_stats_' . md5(@$setting['metric'] . '-' . @$setting['days'] . '-' . (@$setting['this_page_only'] ? $uri : '')),
			$value,
			21600 // 6 hour cache
		);

		return $value;
	}

}