<?php get_header(); ?>
<main>
    <section class="page-hero calculator-hero">
        <div class="wrap">
            <span class="eyebrow">Инженерный инструмент</span>
            <h1>Конвертер концентраций газов</h1>
            <p>Пересчитывайте ppm, мг/м³, % объемной доли и % НКПР с учетом молярной массы газа, давления и температуры. Расчет справочный и помогает быстрее сравнить требования датчиков, приборов и нормативов.</p>
        </div>
    </section>

    <section class="section">
        <div class="wrap calculator-layout" data-gas-calculator>
            <form class="calculator-card calculator-inputs">
                <div class="section-head compact">
                    <span class="eyebrow">Входные данные</span>
                    <h2 class="section-title">Параметры пересчета</h2>
                </div>

                <label class="field">
                    <span>Газ</span>
                    <select data-gas-select></select>
                </label>

                <div class="form-grid">
                    <label class="field">
                        <span>Единица измерения</span>
                        <select data-unit-select>
                            <option value="ppm">ppm (млн⁻¹)</option>
                            <option value="mg_m3">мг/м³</option>
                            <option value="vol_percent">% об. д.</option>
                            <option value="lel_percent">% НКПР</option>
                        </select>
                    </label>
                    <label class="field">
                        <span data-value-label>ppm (млн⁻¹)</span>
                        <input data-value-input type="number" min="0" step="any" value="0" inputmode="decimal">
                    </label>
                </div>

                <div class="calculator-divider"></div>

                <div class="section-head compact calculator-subhead">
                    <span class="eyebrow">Условия среды</span>
                    <p>По умолчанию используются 101,325 кПа и 20 °C.</p>
                </div>

                <div class="form-grid">
                    <label class="field">
                        <span>Давление, кПа</span>
                        <input data-pressure-input type="number" min="1" step="any" value="101.325" inputmode="decimal">
                    </label>
                    <label class="field">
                        <span>Температура, °C</span>
                        <input data-temperature-input type="number" step="any" value="20" inputmode="decimal">
                    </label>
                </div>

                <button class="btn btn-reset" type="button" data-reset-conditions>Вернуть нормальные условия</button>
            </form>

            <aside class="calculator-side">
                <div class="calculator-card">
                    <div class="section-head compact">
                        <span class="eyebrow">Выходные данные</span>
                        <h2 class="section-title">Результат</h2>
                    </div>
                    <div class="calculator-results">
                        <div><span>ppm (млн⁻¹)</span><strong data-result="ppm">0.00000</strong></div>
                        <div><span>мг/м³</span><strong data-result="mg_m3">0.00000</strong></div>
                        <div><span>% об. д.</span><strong data-result="vol_percent">0.00000</strong></div>
                        <div><span>% НКПР</span><strong data-result="lel_percent">0.00000</strong></div>
                    </div>
                </div>

                <div class="calculator-card calculator-info">
                    <div class="section-head compact">
                        <span class="eyebrow">Свойства газа</span>
                        <h2 class="section-title">Справка</h2>
                    </div>
                    <dl>
                        <div><dt>Газ</dt><dd data-info="name">Метан – CH₄</dd></div>
                        <div><dt>Молярная масса</dt><dd data-info="molar">16.04 г/моль</dd></div>
                        <div><dt>НКПР</dt><dd data-info="lel">4.40 % об. д. = 100 % НКПР</dd></div>
                        <div><dt>ПДК</dt><dd data-info="pdk">7000 мг/м³</dd></div>
                    </dl>
                </div>
            </aside>
        </div>
    </section>
</main>
<?php get_footer(); ?>
