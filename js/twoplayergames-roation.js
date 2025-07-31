googletag.cmd.push(function () {
    stpd.rotationSlots = stpd.rotationSlots || {};

    stpd.rotationSlots.single = googletag
    .defineSlot(
        '/22538980388/twoplayergames.org_300x600_game_page_right_desktop',
        [
        [300, 600],
        [300, 250],
        [160, 600],
        [120, 600],
        ],
        'twoplayergames_org_game_page_right_desktop'
    )
    .addService(googletag.pubads());
    stpd.rotationSlots.doubleOne = googletag
    .defineSlot(
        '/22538980388/twoplayergames.org_300x250_game_page_right_top_desktop',
        [
        [300, 250],
        [250, 250],
        [120, 240],
        ],
        'twoplayergames_org_game_page_right_top_desktop'
    )
    .addService(googletag.pubads());

    stpd.rotationSlots.doubleTwo = googletag
    .defineSlot(
        '/22538980388/twoplayergames.org_300x250_game_page_right_bottom_desktop',
        [
        [300, 250],
        [250, 250],
        [120, 240],
        ],
        'twoplayergames_org_game_page_right_bottom_desktop'
    )
    .addService(googletag.pubads());
});

stpd.customBidsBackHandler = function (bids, timedOut, auctionId, adUnit) {
    // Initialize rotation data if not exists
    stpd.rotationData = stpd.rotationData || {
    highestCpms: {},
    auctionCompleted: {},
    };

    // Mark this auction as completed for this ad unit
    stpd.rotationData.auctionCompleted[adUnit] = true;

    // Store only the highest CPM for each ad unit from this call
    Object.keys(bids).forEach((adUnitCode) => {
    const unitBids = bids[adUnitCode]?.bids || [];
    const highestCpm =
        unitBids.length > 0 ? Math.max(...unitBids.map((bid) => bid.cpm)) : 0;
    stpd.rotationData.highestCpms[adUnitCode] = highestCpm;
    });

    // Required ad units for rotation
    const requiredAdUnits = [
    'twoplayergames_org_game_page_right_desktop',
    'twoplayergames_org_game_page_right_top_desktop',
    'twoplayergames_org_game_page_right_bottom_desktop',
    ];

    // Check if auctions are completed for all required ad units
    const allAuctionsCompleted = requiredAdUnits.every(
    (unit) => stpd.rotationData.auctionCompleted[unit] === true
    );

    // Only proceed when all 3 auctions are completed
    if (!allAuctionsCompleted) return;

    const doublePlacementCpm =
    (stpd.rotationData.highestCpms['twoplayergames_org_game_page_right_top_desktop'] || 0) +
    (stpd.rotationData.highestCpms['twoplayergames_org_game_page_right_bottom_desktop'] ||
        0);

    const singlePlacementCpm =
    stpd.rotationData.highestCpms['twoplayergames_org_game_page_right_desktop'] || 0;

    function showDoublePlacement() {
    googletag.cmd.push(function () {
        document.getElementById('twoplayergames_org_game_page_right_desktop').innerHTML = '';

        // Set targeting for double placement
        stpd.setTargetingForGPTAsync('twoplayergames_org_game_page_right_top_desktop');
        stpd.setTargetingForGPTAsync('twoplayergames_org_game_page_right_bottom_desktop');

        const gamKeyPrefix = stpd.vars.prebid?.gam_key_prefix || 'hb_';

        const rfTargetingKey = googletag.pubads().getTargeting(`${gamKeyPrefix}rf`);
        if (rfTargetingKey.length !== 0) {
        googletag.pubads().clearTargeting(`${gamKeyPrefix}rf`);
        }

        stpd.rotationSlots.doubleOne.setTargeting(
        `${gamKeyPrefix}rf`,
        (+(stpd.rotationRefresh ?? false)).toString()
        );
        stpd.rotationSlots.doubleTwo.setTargeting(
        `${gamKeyPrefix}rf`,
        (+(stpd.rotationRefresh ?? false)).toString()
        );

        googletag.display('twoplayergames_org_game_page_right_top_desktop');
        googletag.display('twoplayergames_org_game_page_right_bottom_desktop');
        googletag
        .pubads()
        .refresh([stpd.rotationSlots.doubleOne, stpd.rotationSlots.doubleTwo]);
    });
    }

    function showSinglePlacement() {
    googletag.cmd.push(function () {
        document.getElementById('twoplayergames_org_game_page_right_top_desktop').innerHTML =
        '';
        document.getElementById(
        'twoplayergames_org_game_page_right_bottom_desktop'
        ).innerHTML = '';

        // Set targeting for single placement
        stpd.setTargetingForGPTAsync('twoplayergames_org_game_page_right_desktop');

        const gamKeyPrefix = stpd.vars.prebid?.gam_key_prefix || 'hb_';

        const rfTargetingKey = googletag.pubads().getTargeting(`${gamKeyPrefix}rf`);
        if (rfTargetingKey.length !== 0) {
        googletag.pubads().clearTargeting(`${gamKeyPrefix}rf`);
        }

        stpd.rotationSlots.single.setTargeting(
        `${gamKeyPrefix}rf`,
        (+(stpd.rotationRefresh ?? false)).toString()
        );

        googletag.display('twoplayergames_org_game_page_right_desktop');
        googletag.pubads().refresh([stpd.rotationSlots.single]);
    });
    }

    // Show the higher earning placement
    if (singlePlacementCpm > doublePlacementCpm) {
    showSinglePlacement();
    } else {
    showDoublePlacement();
    }

    // Set flag for subsequent refreshes
    stpd.rotationRefresh = true;

    // Clear rotation data for next time
    stpd.rotationData = { highestCpms: {}, auctionCompleted: {} };
};

// Ad units need to be called after the stpd initialzation
stpd.que.push(() => {
    if (stpd.initialized && stpd.refreshAdUnit) {
    stpd.refreshAdUnit('twoplayergames_org_game_page_right_top_desktop');
    stpd.refreshAdUnit('twoplayergames_org_game_page_right_bottom_desktop');
    stpd.refreshAdUnit('twoplayergames_org_game_page_right_desktop');
    } else {
    let attempts = 0;
    const maxAttempts = 100; // max 10 seconds

    const checkInterval = setInterval(() => {
        attempts++;
        if (stpd.initialized && stpd.refreshAdUnit) {
        clearInterval(checkInterval);
        stpd.refreshAdUnit('twoplayergames_org_game_page_right_top_desktop');
        stpd.refreshAdUnit('twoplayergames_org_game_page_right_bottom_desktop');
        stpd.refreshAdUnit('twoplayergames_org_game_page_right_desktop');
        } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        console.error('Timeout: stpd failed to initialize');
        }
    }, 100);
    }
});