<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminUserPasswordManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_update_user_password_via_dedicated_endpoint(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $student = User::factory()->create([
            'role' => 'student',
            'password' => Hash::make('OldPassword123'),
        ]);

        $newPassword = 'BrandNewPass2026#';

        $response = $this->actingAs($admin)->put(
            route('admin.users.password', $student->id),
            [
                'password' => $newPassword,
                'password_confirmation' => $newPassword,
            ]
        );

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $student->refresh();
        $this->assertTrue(Hash::check($newPassword, $student->password));

        // Test that user can now log in with the new password
        auth()->logout();
        $loginResponse = $this->post(route('login'), [
            'email' => $student->email,
            'password' => $newPassword,
        ]);

        $this->assertAuthenticatedAs($student);
    }

    public function test_admin_can_update_user_password_via_general_update_endpoint(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $teacher = User::factory()->create([
            'role' => 'teacher',
            'password' => Hash::make('TeacherInitialPass1'),
        ]);

        $newPassword = 'TeacherUpgradedPass99!';

        $response = $this->actingAs($admin)->put(
            route('admin.users.update', $teacher->id),
            [
                'name' => 'Prof. Taha Hussein',
                'email' => $teacher->email,
                'role' => 'teacher',
                'national_id' => '29001012600111',
                'phone' => '01012345678',
                'is_active' => true,
                'password' => $newPassword,
            ]
        );

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $teacher->refresh();
        $this->assertEquals('Prof. Taha Hussein', $teacher->name);
        $this->assertTrue(Hash::check($newPassword, $teacher->password));
    }

    public function test_password_validation_enforces_minimum_length_and_confirmation(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $student = User::factory()->create(['role' => 'student']);

        // Test too short
        $responseShort = $this->actingAs($admin)->put(
            route('admin.users.password', $student->id),
            [
                'password' => 'short',
                'password_confirmation' => 'short',
            ]
        );
        $responseShort->assertSessionHasErrors('password');

        // Test confirmation mismatch
        $responseMismatch = $this->actingAs($admin)->put(
            route('admin.users.password', $student->id),
            [
                'password' => 'ValidPassword123!',
                'password_confirmation' => 'DifferentPassword123!',
            ]
        );
        $responseMismatch->assertSessionHasErrors('password');
    }

    public function test_non_admin_cannot_update_user_passwords(): void
    {
        $teacher = User::factory()->create(['role' => 'teacher']);
        $student = User::factory()->create(['role' => 'student']);

        $response = $this->actingAs($teacher)->put(
            route('admin.users.password', $student->id),
            [
                'password' => 'HackerPassword123',
                'password_confirmation' => 'HackerPassword123',
            ]
        );

        $response->assertForbidden();
    }
}
