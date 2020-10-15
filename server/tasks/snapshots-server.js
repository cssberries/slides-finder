const {Cluster} = require('puppeteer-cluster');
var fsx = require('fs-extra');

async function generate(options, states) {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 12,
        monitor: true,
    });

    await cluster.task(async ({page, data: data}) => {
        await page.setViewport({
            width: 1440,
            height: 900,
            deviceScaleFactor: 1,
        });
        await page.goto(data.url, {waitUntil: 'domcontentloaded'});
        const screen = await page.screenshot();
        fsx.ensureDirSync(options.slidesPath);
        await fsx.writeFile(
            `${options.slidesPath}/${
                data.slideName
            }.png`,
            screen
        );
    });

    cluster.on('taskerror', (err, data) => {
        console.log(`  Error crawling ${data}: ${err.message}`);
    });

    if (options.slide) {
        console.log(`http://localhost:5500/slides/${options.slide.state}`);
        cluster.queue({
            url: `http://localhost:5500/slides/${options.slide.state}`,
            slideName: options.slide.component,
        });
    } else {
        for (let i = 0; i < states.length; i++) {
            const state = states[i];
            if (state.componentName !== 'FolderComponent') {
                if (!options.force) {
                    if (
                        !fsx.existsSync(
                            `${options.slidesPath}/${
                                state.componentName
                            }.png`
                        )
                    ) {
                        cluster.queue({
                            url: `http://localhost:5500/slides/${state.path}`,
                            slideName: state.componentName,
                        });
                    }
                } else {
                    cluster.queue({
                        url: `http://localhost:5500/slides/${state.path}`,
                        slideName: state.componentName,
                    });
                }
            }
        }
    }
    await cluster.idle();
    await cluster.close();
}
module.exports.generate = generate;
