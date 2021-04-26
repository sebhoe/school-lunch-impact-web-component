<svelte:options tag="my-component" />

<script>
  const ADULT_NUTRITION = 2000,
    CHILD_NUTRITION = 1800,
    ADULT_TO_CHILD_FAKTOR = CHILD_NUTRITION / ADULT_NUTRITION,
    KCAL_MEAT_TO_PLANT = 0.000684,
    KCAL_MEAT_TO_VEG = 0.00046,
    KCAL_VEG_TO_PLANT = 0.000224,
    CARBON_PER_KM = 120 / 1000000,
    WATER_PER_MEAL = (3000 - 1700) * 0.25,
    LITER_PER_BATHTUB = 150,
    LAND_PER_MEAL_MEAT_TO_VEG = (790 / 365) * 0.25,
    LAND_PER_MEAL_MEAT_TO_PLANT = (970 / 365) * 0.25,
    LAND_PER_MEAL_VEG_TO_PLANT = ((970 - 790) / 365) * 0.25,
    SQUARE_METER_PER_PITCH = 7140;

  let menuLines = 2,
    minMenuLines = 1,
    maxMenuLines = 7,
    meatToPlant = 1,
    meatToVeg = 1,
    vegToPlant = 1,
    dishesPerDay = 200,
    maxDishesPerDay = 10000,
    daysPerWeek = 5,
    daysPerYear = 200;

  $: carbonMeatToVeg =
    ((meatToVeg * dishesPerDay) / menuLines) *
    daysPerYear *
    KCAL_MEAT_TO_VEG *
    ADULT_TO_CHILD_FAKTOR;
  $: carbonMeatToPlant =
    ((meatToPlant * dishesPerDay) / menuLines) *
    daysPerYear *
    KCAL_MEAT_TO_PLANT *
    ADULT_TO_CHILD_FAKTOR;
  $: carbonVegToPlant =
    ((vegToPlant * dishesPerDay) / menuLines) *
    daysPerYear *
    KCAL_VEG_TO_PLANT *
    ADULT_TO_CHILD_FAKTOR;
  $: sumCarbon = carbonMeatToVeg + carbonMeatToPlant + carbonVegToPlant;

  $: waterMeatToVeg =
    ((meatToVeg * dishesPerDay) / menuLines) * daysPerYear * WATER_PER_MEAL;
  $: waterMeatToPlant =
    ((meatToPlant * dishesPerDay) / menuLines) * daysPerYear * WATER_PER_MEAL;
  // $: waterVegToPlant =
  // 	((vegToPlant * dishesPerDay) / menuLines) *
  // 	daysPerYear * WATER_PER_MEAL;
  $: sumWater = waterMeatToVeg + waterMeatToPlant;

  $: landMeatToVeg =
    ((meatToVeg * dishesPerDay) / menuLines) *
    daysPerYear *
    LAND_PER_MEAL_MEAT_TO_VEG *
    ADULT_TO_CHILD_FAKTOR;
  $: landMeatToPlant =
    ((meatToPlant * dishesPerDay) / menuLines) *
    daysPerYear *
    LAND_PER_MEAL_MEAT_TO_PLANT *
    ADULT_TO_CHILD_FAKTOR;
  $: landVegToPlant =
    ((vegToPlant * dishesPerDay) / menuLines) *
    daysPerYear *
    LAND_PER_MEAL_VEG_TO_PLANT *
    ADULT_TO_CHILD_FAKTOR;
  $: sumLand = landMeatToVeg + landMeatToPlant + landVegToPlant;
</script>

<main>
  <h1>Schulverpflegung Impact Rechner</h1>

  <ol>
    <li>
      <h2>
        Wie viele <strong>Menülinien</strong> bieten Sie an?
      </h2>
      <p class="flex-wrapper">
        <input
          type="range"
          bind:value={menuLines}
          min={minMenuLines}
          max={maxMenuLines}
        />
        <input
          type="number"
          bind:value={menuLines}
          min={minMenuLines}
          max={maxMenuLines}
        />
      </p>
    </li>

    <li>
      <h2>
        Wie viele <strong>Gerichte</strong> in Ihren Menülinien möchten Sie klima-
        und umweltfreundlicher gestalten (pro Woche)?
      </h2>
      <div class="flex-wrapper flex-wrapper--space-around">
        <div class="flex-wrapper flex-wrapper--col">
          <p class="large-icons">🍖 🔜 🧀</p>
          <label class="inline">
            <input
              name="KCAL_meat_to_plant"
              type="number"
              bind:value={meatToPlant}
              min="0"
              max="100"
            />
            Gerichte
          </label>
          <small>vegetarisch statt fleischhaltig</small>
        </div>

        <div class="flex-wrapper flex-wrapper--col">
          <p class="large-icons">🍖 🔜 🌱</p>
          <label class="inline">
            <input
              name="KCAL_meat_to_veg"
              type="number"
              bind:value={meatToVeg}
              min="0"
              max="100"
            />
            Gerichte
          </label>
          <small>rein pflanzlich statt fleischhaltig</small>
        </div>

        <div class="flex-wrapper flex-wrapper--col">
          <p class="large-icons">🧀 🔜 🌱</p>
          <label class="inline">
            <input
              name="KCAL_veg_to_plant"
              type="number"
              bind:value={vegToPlant}
              min="0"
              max="100"
            />
            Gerichte
          </label>
          <small>rein pflanzlich statt vegetarisch</small>
        </div>
      </div>
    </li>

    <li>
      <h2>
        Wie viele <strong>Portionen</strong> bereiten Sie bei regulärem
        Schulbetrieb <strong>pro Tag</strong> zu?
      </h2>
      <p class="flex-wrapper">
        <label class="inline">
          <input
            type="number"
            bind:value={dishesPerDay}
            min="0"
            max={maxDishesPerDay}
          />
          Portionen
        </label>
      </p>

      <!-- <p>
				(( {meatToPlant} + {meatToVeg} + {vegToPlant}
				) * {dishesPerDay} / {menuLines} ) * {daysPerYear}
				= {(((meatToPlant + meatToVeg + vegToPlant) * dishesPerDay) /
					menuLines) *
					daysPerYear}
			</p> -->
    </li>
  </ol>

  <section>
    <h2>
      Durch den Einsatz von
      <strong>
        {(meatToPlant + meatToVeg + vegToPlant) * dishesPerDay * daysPerWeek}
        klima- und umweltfreundlicheren Mahlzeiten
      </strong>
      pro Woche sparen sie im Jahr etwa
    </h2>
  </section>

  <section>
    <div class="banner">
      <div>
        <p>
          <strong class="text text--large">Wir sparen pro Jahr</strong>
          <br />
          durch die Reduktion von tierischen Lebensmitteln in der Schulverpflegung
          bis zu...
        </p>
      </div>
      <div class="logo">
        <img src="proveg-logo.svg" alt="proveg logo" />
      </div>
    </div>
    <div class="banner">
      <div class="icon">
        <img src="carbon.png" alt="carbon icon" />
      </div>
      <div>
        <p>
          <strong class="text text--orange text--large">
            {sumCarbon.toLocaleString(undefined, {
              maximumFractionDigits: 3,
            })}
          </strong>
          <span class="text text--orange">
            Tonnen CO<sub>2</sub>-Equivalente,
          </span>
          <br />das entspricht
          <strong class="text text--orange text--large">
            {(sumCarbon / CARBON_PER_KM).toLocaleString()}
          </strong>
          <span class="text text--orange">km mit dem Auto</span>
        </p>
      </div>
      <div class="logo">
        <img src="proveg-logo.svg" alt="proveg logo" />
      </div>
      <div class="link">berechnet auf proveg.com/de/impact-rechner</div>
    </div>
    <div class="banner">
      <div class="icon">
        <img src="waterdrop.png" alt="waterdrop icon" />
      </div>
      <div>
        <p>
          <strong class="text text--blue text--large">
            {sumWater.toLocaleString()}
          </strong>
          <span class="text text--blue">Liter Wasser,</span>
          <br />das entspricht
          <strong class="text text--blue text--large">
            {(sumWater / LITER_PER_BATHTUB).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </strong>
          <span class="text text--blue">Badewannen</span>
        </p>
      </div>
      <div class="logo">
        <img src="proveg-logo.svg" alt="proveg logo" />
      </div>
      <div class="link">berechnet auf proveg.com/de/impact-rechner</div>
    </div>
    <div class="banner">
      <div class="icon">
        <img src="forrest.png" alt="forrest icon" />
      </div>
      <div>
        <p>
          <strong class="text text--green text--large">
            {sumLand.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </strong>
          <span class="text text--green">m<sup>2</sup> Land,</span>
          <br />das entspricht
          <strong class="text text--green text--large">
            {(sumLand / SQUARE_METER_PER_PITCH).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </strong>
          <span class="text text--green">Fußballfeldern</span>
        </p>
      </div>
      <div class="logo">
        <img src="proveg-logo.svg" alt="proveg logo" />
      </div>
      <div class="link">berechnet auf proveg.com/de/impact-rechner</div>
    </div>
  </section>
  <section class="spacer" />
</main>

<style lang="scss">
  main {
    text-align: center;
    /* padding: 1em; */
    min-width: 258px;
    margin: 0 auto;
    color: #11284a;
  }

  h1 {
    /* text-transform: uppercase; */
    /* font-size: 4em; */
    font-weight: 500;
  }

  h2 {
    font-size: 1.2em;
    font-weight: 400;
  }

  ol {
    list-style: inside decimal;
    padding-left: 0;

    li {
      margin-bottom: 3rem;

      &::marker {
        display: inline;
      }

      h2 {
        display: inline;
      }
    }
  }

  .flex-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;

    &--col {
      flex-direction: column;
    }

    &--space-around {
      justify-content: space-around;
    }
  }

  .large-icons {
    font-size: 3em;
    margin: 8px 0;
  }

  .text {
    &--large {
      font-size: 1.75em;
      font-weight: 500;
      text-transform: uppercase;
    }

    &--orange {
      color: #f39529;
    }

    &--blue {
      color: #73c1e9;
    }

    &--green {
      color: #3fab33;
    }
  }

  .banner {
    position: relative;
    display: flex;
    text-align: left;
    font-size: 0.85em;
    letter-spacing: 0.5px;
    line-height: 1.3;
    color: white;
    background-color: #11284a;
    padding: 8px 12px;
    margin: 1rem auto;
    max-width: 500px;

    .icon {
      align-self: center;
      flex: 0 0 80px;
      margin-right: 12px;
    }

    .logo {
      position: absolute;
      top: 8px;
      right: 6px;
      width: 60px;
    }

    img {
      width: 100%;
    }

    .link {
      position: absolute;
      right: 6px;
      bottom: 6px;
      font-size: 0.7em;
      font-style: italic;
    }

    @media (min-width: 640px) {
      font-size: initial;

      .icon {
        flex-basis: 100px;
      }

      .logo {
        top: 12px;
        right: 12px;
        width: 100px;
      }
    }
  }

  .inline {
    display: inline;
  }

  input,
  button,
  select,
  textarea {
    font-family: inherit;
    font-size: inherit;
    -webkit-padding: 0.4em 0;
    padding: 0.4em;
    margin: 0 0 0.5em 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 2px;
  }

  input:disabled {
    color: #ccc;
  }

  input[type="range"] {
    -webkit-appearance: none;
    border: none;
    /* width: 100%; */
  }
  input[type="range"]:focus {
    outline: none;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    /* width: 100%; */
    height: 8.4px;
    cursor: pointer;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    background: #3071a9;
    border-radius: 1.3px;
    border: 0.2px solid #010101;
  }
  input[type="range"]::-webkit-slider-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -14px;
  }
  input[type="range"]:focus::-webkit-slider-runnable-track {
    background: #367ebd;
  }
  input[type="range"]::-moz-range-track {
    /* width: 100%; */
    height: 8.4px;
    cursor: pointer;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    background: #3071a9;
    border-radius: 1.3px;
    border: 0.2px solid #010101;
  }
  input[type="range"]::-moz-range-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
  }
  input[type="range"]::-ms-track {
    /* width: 100%; */
    height: 8.4px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    border-width: 16px 0;
    color: transparent;
  }
  input[type="range"]::-ms-fill-lower {
    background: #2a6495;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }
  input[type="range"]::-ms-fill-upper {
    background: #3071a9;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }
  input[type="range"]::-ms-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
  }
  input[type="range"]:focus::-ms-fill-lower {
    background: #3071a9;
  }
  input[type="range"]:focus::-ms-fill-upper {
    background: #367ebd;
  }

  .spacer {
    height: 1rem;
    margin-top: 10rem;
  }

  @media (min-width: 640px) {
    main {
      max-width: 770px;
    }
  }
</style>
