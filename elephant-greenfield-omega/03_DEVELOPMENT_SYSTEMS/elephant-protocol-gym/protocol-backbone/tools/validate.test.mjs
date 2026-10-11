import test from 'node:test';
import assert from 'node:assert/strict';
import {validate} from './validate.mjs';
test('Protocol registry, all mapped modules and candidate NOT_RUN run receipt are structurally coherent',()=>{
 const x=validate();assert.equal(x.ok,true,x.errors.join('\n'));assert.ok(x.protocol_cards>=9);assert.ok(x.assets>=19);assert.ok(x.crosswalk_entries>=19);assert.ok(x.composition_profiles>=4);
});
test('Validator explicitly labels partial source mappings rather than silently treating cards as replacements',()=>{
 const x=validate();assert.ok(x.warnings.some(y=>y.includes('PARTIAL_MAPPING')));
});
